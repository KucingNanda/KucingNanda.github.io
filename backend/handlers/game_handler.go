package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"github.com/gofiber/fiber/v2"
)

// GetGames mengambil daftar game dari database
func GetGames(c *fiber.Ctx) error {
	var games []models.Game
	result := database.DB.Find(&games)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(games)
}

// CreateGame untuk menambah data game baru
func CreateGame(c *fiber.Ctx) error {
	var input models.Game
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdateGame memperbarui data game berdasarkan ID
func UpdateGame(c *fiber.Ctx) error {
	id := c.Params("id")
	var game models.Game

	if err := database.DB.First(&game, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Game tidak ditemukan"})
	}

	var input models.Game
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	database.DB.Model(&game).Updates(input)
	return c.Status(fiber.StatusOK).JSON(game)
}

// DeleteGame menghapus data game berdasarkan ID
func DeleteGame(c *fiber.Ctx) error {
	id := c.Params("id")
	var game models.Game

	if err := database.DB.First(&game, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Game tidak ditemukan"})
	}

	database.DB.Delete(&game)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Game berhasil dihapus"})
}
