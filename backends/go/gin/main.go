package main

import (
	"fmt"
	"rest-collection-gin/database"
	"rest-collection-gin/logging"
	"rest-collection-gin/routers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger

func main() {
	dbpool := database.SetupTablesIfNotExist()
	logging.Logger.Debug("dbpool: ", dbpool)

	r := routers.SetupRouter(dbpool)
	r.Use(cors.Default())
	r.Use(func(c *gin.Context) {
		c.Set("dbpool", dbpool)
		c.Next()
	})
	r.Run(":8080")

	fmt.Println("Hello, world!")
}
