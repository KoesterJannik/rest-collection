package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func GoDotEnvVariable(key string) string {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}
func InjectDB(dbpool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("dbpool", dbpool)
		c.Next()
	}
}
func SetupTablesIfNotExist() *pgxpool.Pool {
	DB_URL := GoDotEnvVariable("DB_URL")
	fmt.Printf("godotenv : %s = %s \n", "DB URL", DB_URL)
	dbpool, err := pgxpool.New(context.Background(), DB_URL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}

	err = createUserTable(dbpool)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create user table: %v\n", err)
		os.Exit(1)
	}
	// return dbpool

	return dbpool

}
func GetUserById(pool *pgxpool.Pool, id int) (*User, error) {
	selectUserSQL := `
    SELECT * FROM users WHERE id = $1;
`

	user := &User{}
	err := pool.QueryRow(context.Background(), selectUserSQL, id).Scan(&user.ID, &user.Email, &user.Password)
	user.Password = ""
	if err != nil {
		return nil, fmt.Errorf("failed to select user: %v", err)
	}

	return user, nil

}
func createUserTable(pool *pgxpool.Pool) error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		refresh_token VARCHAR(255)  NULL
	);
	`
	_, err := pool.Exec(context.Background(), createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}

	return nil
}

func CreateUser(pool *pgxpool.Pool, email string, password string) error {
	insertUserSQL := `
	INSERT INTO users (email, password) VALUES ($1, $2);
	`

	_, err := pool.Exec(context.Background(), insertUserSQL, email, password)
	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}

	return nil
}
func IsEmailInUse(pool *pgxpool.Pool, email string) (bool, error) {
	selectUserSQL := `
	SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);
	`

	var exists bool
	err := pool.QueryRow(context.Background(), selectUserSQL, email).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to select user: %v", err)
	}

	return exists, nil
}

type User struct {
	ID       int
	Email    string
	Password string
}

func GetUserByEmail(pool *pgxpool.Pool, email string) (*User, error) {
	selectUserSQL := `
        SELECT * FROM users WHERE email = $1;
    `

	user := &User{}
	err := pool.QueryRow(context.Background(), selectUserSQL, email).Scan(&user.ID, &user.Email, &user.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to select user: %v", err)
	}

	return user, nil
}
