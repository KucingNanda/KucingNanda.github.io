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

// CreateProfile membuat data profil baru
func CreateProfile(c *gin.Context) {
	var input models.Profile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

// UpdateProfile untuk memperbarui data profil
func UpdateProfile(c *gin.Context) {
	var input models.Profile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var profile models.Profile
	if err := database.DB.First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profil tidak ditemukan"})
		return
	}
	
	database.DB.Model(&profile).Updates(input)
	c.JSON(http.StatusOK, profile)
}

// DeleteProfile menghapus data profil
func DeleteProfile(c *gin.Context) {
	var profile models.Profile
	if err := database.DB.First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profil tidak ditemukan"})
		return
	}

	database.DB.Delete(&profile)
	c.JSON(http.StatusOK, gin.H{"message": "Profil berhasil dihapus"})
}
