package main

import (
	"gamer-hub-api/database"
	"gamer-hub-api/routes"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Inisialisasi Database
	database.ConnectDatabase()

	// 2. Setup Gin Engine
	r := gin.Default()

	// 3. Panggil Routes
	routes.SetupRoutes(r)

	// 4. Jalankan Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
