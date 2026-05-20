package database

import (
	"fmt"
	"log"
	"os"

	"gamer-hub-api/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// ConnectDatabase menginisialisasi koneksi ke MySQL Alwaysdata
func ConnectDatabase() {
	// Load file .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Ambil environment variables
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Format DSN (Data Source Name) untuk MySQL
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	// Konfigurasi GORM dengan Logger Silent sesuai permintaan
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent), // Menonaktifkan log query panjang
	})

	if err != nil {
		log.Fatal("Gagal terhubung ke database: ", err)
	}

	fmt.Println("✅ Koneksi Database Berhasil (Log: Silent)")

	// Auto-Migrate tabel berdasarkan model di roadmap
	err = db.AutoMigrate(&models.User{}, &models.Gallery{}, &models.Game{}, &models.Profile{}, &models.Vault{})
	if err != nil {
		log.Fatal("Gagal melakukan migrasi database: ", err)
	}

	DB = db
}
