package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"github.com/gofiber/fiber/v2"
)

// GetGalleries mengambil semua data gallery dari database
func GetGalleries(c *fiber.Ctx) error {
	var galleries []models.Gallery

	// Mengambil data dan mengurutkan berdasarkan yang terbaru
	result := database.DB.Order("created_at desc").Find(&galleries)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(galleries)
}

// CreateGallery menambahkan item baru ke gallery
func CreateGallery(c *fiber.Ctx) error {
	var input models.Gallery
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdateGallery memperbarui item gallery berdasarkan ID
func UpdateGallery(c *fiber.Ctx) error {
	id := c.Params("id")
	var gallery models.Gallery

	if err := database.DB.First(&gallery, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Gallery tidak ditemukan"})
	}

	var input models.Gallery
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	database.DB.Model(&gallery).Updates(input)
	return c.Status(fiber.StatusOK).JSON(gallery)
}

// DeleteGallery menghapus item gallery berdasarkan ID
func DeleteGallery(c *fiber.Ctx) error {
	id := c.Params("id")
	var gallery models.Gallery

	if err := database.DB.First(&gallery, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Gallery tidak ditemukan"})
	}

	database.DB.Delete(&gallery)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Gallery berhasil dihapus"})
}
