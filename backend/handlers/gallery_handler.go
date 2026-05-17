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

// CreateGallery menambahkan item baru ke gallery
func CreateGallery(c *gin.Context) {
	var input models.Gallery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

// UpdateGallery memperbarui item gallery berdasarkan ID
func UpdateGallery(c *gin.Context) {
	id := c.Param("id")
	var gallery models.Gallery

	if err := database.DB.First(&gallery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gallery tidak ditemukan"})
		return
	}

	var input models.Gallery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&gallery).Updates(input)
	c.JSON(http.StatusOK, gallery)
}

// DeleteGallery menghapus item gallery berdasarkan ID
func DeleteGallery(c *gin.Context) {
	id := c.Param("id")
	var gallery models.Gallery

	if err := database.DB.First(&gallery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gallery tidak ditemukan"})
		return
	}

	database.DB.Delete(&gallery)
	c.JSON(http.StatusOK, gin.H{"message": "Gallery berhasil dihapus"})
}
