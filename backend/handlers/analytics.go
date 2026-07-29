package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"

	"github.com/gofiber/fiber/v2"
)

type AnalyticsResponse struct {
	TotalGalleries int64          `json:"total_galleries"`
	TotalGames     int64          `json:"total_games"`
	TotalVaults    int64          `json:"total_vaults"`
	CategoryStats  []CategoryStat `json:"category_stats"`
}

type CategoryStat struct {
	Category string `json:"category"`
	Count    int64  `json:"count"`
}

// GetAnalytics mengembalikan ringkasan statistik untuk dashboard admin
func GetAnalytics(c *fiber.Ctx) error {
	db := database.DB

	var totalGalleries, totalGames, totalVaults int64

	db.Model(&models.Gallery{}).Count(&totalGalleries)
	db.Model(&models.Game{}).Count(&totalGames)
	db.Model(&models.Vault{}).Count(&totalVaults)

	var categoryStats []CategoryStat
	// Menghitung berdasarkan `Info` (contoh: AI Art, Cosplay, dll)
	db.Model(&models.Gallery{}).Select("info as category, count(*) as count").Group("info").Scan(&categoryStats)

	// Bersihkan kategori kosong
	for i, stat := range categoryStats {
		if stat.Category == "" {
			categoryStats[i].Category = "Uncategorized"
		}
	}

	response := AnalyticsResponse{
		TotalGalleries: totalGalleries,
		TotalGames:     totalGames,
		TotalVaults:    totalVaults,
		CategoryStats:  categoryStats,
	}

	return c.JSON(response)
}
