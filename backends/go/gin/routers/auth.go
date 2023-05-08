package routers

import (
	"fmt"
	"net/http"
	"os"
	"rest-collection-gin/database"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type RegisterPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func hashPassword(password string) (string, error) {
	// Generate a salt for the password hash
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error generating hash from password:", err)
		return "", err
	}

	return string(hash), nil
}

func verifyPassword(hashedPassword string, plainPwd string) bool {
	byteHash := []byte(hashedPassword)
	err := bcrypt.CompareHashAndPassword(byteHash, []byte(plainPwd))
	if err != nil {
		fmt.Println("Error comparing hash and password:", err)
		return false
	}
	return true

}

func createToken(userId int) (string, error) {
	// Set the JWT claims, including the user ID and expiration time
	jwtDurationStr := database.GoDotEnvVariable("JWT_DURATION_IN_HOURS")
	jwtSecret := []byte(database.GoDotEnvVariable("JWT_SECRET"))

	// Convert the JWT duration to an int
	jwtDuration, err := strconv.Atoi(jwtDurationStr)
	if err != nil {
		// Handle the error if the conversion fails
		fmt.Println("Error converting JWT duration to int:", err)
		os.Exit(1)
	}
	jwtDurationDuration := time.Duration(jwtDuration) * time.Hour

	claims := jwt.MapClaims{
		"userId": userId,
		"exp":    time.Now().Add(jwtDurationDuration).Unix(), // Token expires in 24 hours
	}

	// Create the JWT token with the RS256 signing method and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token using the secret key

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			jwtSecret := []byte(database.GoDotEnvVariable("JWT_SECRET"))
			return []byte(jwtSecret), nil
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userId := claims["userId"].(float64)
			c.Set("userId", int(userId))
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		}
	}
}

func SetupRouter(dbpool *pgxpool.Pool) *gin.Engine {
	router := gin.Default()
	router.Use(database.InjectDB(dbpool))
	router.POST("/auth/register", func(c *gin.Context) {
		var payload RegisterPayload
		err := c.BindJSON(&payload)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dbpool := c.MustGet("dbpool").(*pgxpool.Pool)
		emailInUse, err := database.IsEmailInUse(dbpool, payload.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if emailInUse {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use"})
			return
		}
		hashedPassword, err := hashPassword(payload.Password)
		err = database.CreateUser(dbpool, payload.Email, hashedPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		user, err := database.GetUserByEmail(dbpool, payload.Email)
		jwtToken, err := createToken(user.ID)
		c.JSON(http.StatusOK, gin.H{"token": jwtToken})
	})

	router.POST("/auth/login", func(c *gin.Context) {
		var payload RegisterPayload
		err := c.BindJSON(&payload)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dbpool := c.MustGet("dbpool").(*pgxpool.Pool)
		user, err := database.GetUserByEmail(dbpool, payload.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if !verifyPassword(user.Password, payload.Password) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
			return
		}
		jwtToken, err := createToken(user.ID)
		c.JSON(http.StatusOK, gin.H{"token": jwtToken})
	})

	router.GET("/auth/me", authMiddleware(), func(c *gin.Context) {
		userId := c.GetInt("userId")
		fullUser, err := database.GetUserById(c.MustGet("dbpool").(*pgxpool.Pool), userId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"user": fullUser})
	})

	return router
}
