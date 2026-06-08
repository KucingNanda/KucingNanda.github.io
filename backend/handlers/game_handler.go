package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"gamer-hub-api/services"
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
	if string(c.Request().Header.ContentType()) == "application/json" {
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
	} else {
		input.GameName = c.FormValue("game_name")
		input.Nickname = c.FormValue("nickname")
		input.UID = c.FormValue("uid")
		input.Bio = c.FormValue("bio")
		input.IconURL = c.FormValue("icon_url")
	}

	file, err := c.FormFile("icon")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file, "KucingAbu/Games")
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload icon game: " + errUpload.Error()})
		}
		input.IconURL = secureURL
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
	if string(c.Request().Header.ContentType()) == "application/json" {
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		if input.GameName != "" { game.GameName = input.GameName }
		if input.Nickname != "" { game.Nickname = input.Nickname }
		if input.UID != "" { game.UID = input.UID }
		if input.Bio != "" { game.Bio = input.Bio }
		if input.IconURL != "" { game.IconURL = input.IconURL }
	} else {
		if val := c.FormValue("game_name"); val != "" { game.GameName = val }
		if val := c.FormValue("nickname"); val != "" { game.Nickname = val }
		if val := c.FormValue("uid"); val != "" { game.UID = val }
		if val := c.FormValue("bio"); val != "" { game.Bio = val }
		if val := c.FormValue("icon_url"); val != "" { game.IconURL = val }
	}

	file, err := c.FormFile("icon")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file, "KucingAbu/Games")
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload icon game: " + errUpload.Error()})
		}
		game.IconURL = secureURL
	}

	database.DB.Save(&game)
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
