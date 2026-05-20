package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"github.com/gofiber/fiber/v2"
)

// GetProfile mengambil data profil user
func GetProfile(c *fiber.Ctx) error {
	var profile models.Profile
	// Mengambil profil pertama (karena ini personal hub)
	result := database.DB.First(&profile)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profil belum diatur"})
	}
	return c.Status(fiber.StatusOK).JSON(profile)
}

// CreateProfile membuat data profil baru
func CreateProfile(c *fiber.Ctx) error {
	var input models.Profile
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdateProfile untuk memperbarui data profil
func UpdateProfile(c *fiber.Ctx) error {
	var input models.Profile
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var profile models.Profile
	if err := database.DB.First(&profile).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profil tidak ditemukan"})
	}
	
	database.DB.Model(&profile).Updates(input)
	return c.Status(fiber.StatusOK).JSON(profile)
}

// DeleteProfile menghapus data profil
func DeleteProfile(c *fiber.Ctx) error {
	var profile models.Profile
	if err := database.DB.First(&profile).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profil tidak ditemukan"})
	}

	database.DB.Delete(&profile)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Profil berhasil dihapus"})
}
