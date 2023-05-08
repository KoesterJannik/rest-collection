package main

import (
	"fmt"
	"rest-collection-gin/database"
	"rest-collection-gin/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	dbpool := database.SetupTablesIfNotExist()

	r := routers.SetupRouter(dbpool)
	r.Use(func(c *gin.Context) {
		c.Set("dbpool", dbpool)
		c.Next()
	})
	r.Run(":8080")

	fmt.Println("Hello, world!")
}
