package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProfile mengambil data profil user
func GetProfile(c *gin.Context) {
	var profile models.Profile
	// Mengambil profil pertama (karena ini personal hub)
	result := database.DB.First(&profile)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profil belum diatur"})
		return
	}
	c.JSON(http.StatusOK, profile)
}

// UpdateProfile untuk memperbarui data profil
func UpdateProfile(c *gin.Context) {
	var input models.Profile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var profile models.Profile
	database.DB.First(&profile)
	database.DB.Model(&profile).Updates(input)

	c.JSON(http.StatusOK, profile)
}
