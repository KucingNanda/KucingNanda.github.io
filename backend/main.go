package main

import (
	"gamer-hub-api/database"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	// Hubungkan ke database
	database.ConnectDatabase()

	// Inisialisasi Gin Gonic
	r := gin.Default()

	// Route dasar untuk testing
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Gamer Hub API is Running",
		})
	})

	// Jalankan server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
