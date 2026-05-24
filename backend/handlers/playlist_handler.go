package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"gamer-hub-api/services"
	"github.com/gofiber/fiber/v2"
)

// GetPlaylist mengambil semua daftar lagu
func GetPlaylist(c *fiber.Ctx) error {
	var playlists []models.Playlist
	database.DB.Find(&playlists)
	return c.Status(fiber.StatusOK).JSON(playlists)
}

// CreatePlaylist menambah lagu baru ke daftar putar
func CreatePlaylist(c *fiber.Ctx) error {
	var input models.Playlist
	
	input.Title = c.FormValue("title")
	input.AudioURL = c.FormValue("audio_url") // bisa kosong jika user upload file

	// Cek apakah ada file audio yang di-upload
	file, err := c.FormFile("audio")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload audio: " + errUpload.Error()})
		}
		input.AudioURL = secureURL
	} else if input.AudioURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Harus menyertakan file audio atau URL"})
	}

	if input.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Judul lagu tidak boleh kosong"})
	}

	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdatePlaylist memperbarui data lagu (biasanya mengganti judul)
func UpdatePlaylist(c *fiber.Ctx) error {
	id := c.Params("id")
	var playlist models.Playlist
	if err := database.DB.First(&playlist, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lagu tidak ditemukan"})
	}

	title := c.FormValue("title")
	if title != "" {
		playlist.Title = title
	}

	file, err := c.FormFile("audio")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload audio baru: " + errUpload.Error()})
		}
		playlist.AudioURL = secureURL
	}

	database.DB.Save(&playlist)
	return c.Status(fiber.StatusOK).JSON(playlist)
}

// DeletePlaylist menghapus lagu dari daftar
func DeletePlaylist(c *fiber.Ctx) error {
	id := c.Params("id")
	var playlist models.Playlist
	if err := database.DB.First(&playlist, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lagu tidak ditemukan"})
	}

	database.DB.Delete(&playlist)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Lagu berhasil dihapus"})
}
