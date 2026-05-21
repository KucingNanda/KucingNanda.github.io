package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"gamer-hub-api/services"
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
	// Fallback ke BodyParser jika bukan form-data (untuk kompatibilitas)
	var input models.Gallery
	if string(c.Request().Header.ContentType()) == "application/json" {
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
	} else {
		// Parse dari form-data
		input.Title = c.FormValue("title")
		input.Info = c.FormValue("info")
		input.Category = c.FormValue("category")
		input.Tags = c.FormValue("tags")
		input.ImageURL = c.FormValue("image_url") // Jika dikirim teks
	}

	// Handle Upload Image jika ada file fisik
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload gambar: " + errUpload.Error()})
		}
		input.ImageURL = secureURL
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

	// Proses pembaruan data
	if string(c.Request().Header.ContentType()) == "application/json" {
		var input models.Gallery
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		// Update secara spesifik
		if input.Title != "" { gallery.Title = input.Title }
		if input.Info != "" { gallery.Info = input.Info }
		if input.Category != "" { gallery.Category = input.Category }
		if input.Tags != "" { gallery.Tags = input.Tags }
		if input.ImageURL != "" { gallery.ImageURL = input.ImageURL }
	} else {
		if title := c.FormValue("title"); title != "" { gallery.Title = title }
		if info := c.FormValue("info"); info != "" { gallery.Info = info }
		if category := c.FormValue("category"); category != "" { gallery.Category = category }
		if tags := c.FormValue("tags"); tags != "" { gallery.Tags = tags }
		if imgURL := c.FormValue("image_url"); imgURL != "" { gallery.ImageURL = imgURL }
	}

	// Tangani pembaruan gambar fisik jika dilampirkan
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload gambar: " + errUpload.Error()})
		}
		gallery.ImageURL = secureURL
	}

	database.DB.Save(&gallery)
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
