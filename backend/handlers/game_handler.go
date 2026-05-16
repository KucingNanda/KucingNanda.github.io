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

// CreateGame untuk menambah data game baru (Admin/Internal)
func CreateGame(c *gin.Context) {
	var input models.Game
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}
