package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetGames mengambil daftar game dari database
func GetGames(c *gin.Context) {
	var games []models.Game
	result := database.DB.Find(&games)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, games)
}

// CreateGame untuk menambah data game baru
func CreateGame(c *gin.Context) {
	var input models.Game
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

// UpdateGame memperbarui data game berdasarkan ID
func UpdateGame(c *gin.Context) {
	id := c.Param("id")
	var game models.Game

	if err := database.DB.First(&game, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game tidak ditemukan"})
		return
	}

	var input models.Game
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&game).Updates(input)
	c.JSON(http.StatusOK, game)
}

// DeleteGame menghapus data game berdasarkan ID
func DeleteGame(c *gin.Context) {
	id := c.Param("id")
	var game models.Game

	if err := database.DB.First(&game, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game tidak ditemukan"})
		return
	}

	database.DB.Delete(&game)
	c.JSON(http.StatusOK, gin.H{"message": "Game berhasil dihapus"})
}
