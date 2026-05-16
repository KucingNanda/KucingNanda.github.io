package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetGalleries mengambil semua data gallery dari database
func GetGalleries(c *gin.Context) {
	var galleries []models.Gallery

	// Mengambil data dan mengurutkan berdasarkan yang terbaru
	result := database.DB.Order("created_at desc").Find(&galleries)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, galleries)
}

// CreateGallery menambahkan item baru ke gallery (Optional untuk admin nanti)
func CreateGallery(c *gin.Context) {
	var input models.Gallery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}
