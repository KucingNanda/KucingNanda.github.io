package main

import (
	"gamer-hub-api/database"
	"gamer-hub-api/routes"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// 1. Inisialisasi Database
	database.ConnectDatabase()

	// 2. Jalankan Seeder (opsional, hanya mengisi jika tabel kosong)
	// database.SeedAll() // Dinonaktifkan karena sudah menggunakan data asli

	// 2. Setup Fiber App
	app := fiber.New()

	// 3. Panggil Routes
	routes.SetupRoutes(app)

	// 4. Jalankan Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	app.Listen(":" + port)
}
