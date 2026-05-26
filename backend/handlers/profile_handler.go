package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"gamer-hub-api/services"
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
	if string(c.Request().Header.ContentType()) == "application/json" {
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
	} else {
		input.Nickname = c.FormValue("nickname")
		input.Bio = c.FormValue("bio")
		input.CurrentStatus = c.FormValue("current_status")
		input.SocialLinks = c.FormValue("social_links")
		input.TechStack = c.FormValue("tech_stack")
		input.AvatarURL = c.FormValue("avatar_url")
	}

	// Tangani upload gambar (opsional)
	file, err := c.FormFile("avatar")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload gambar profil: " + errUpload.Error()})
		}
		input.AvatarURL = secureURL
	}

	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdateProfile untuk memperbarui data profil
func UpdateProfile(c *fiber.Ctx) error {
	var input models.Profile
	var profile models.Profile

	if err := database.DB.First(&profile).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profil tidak ditemukan"})
	}

	if string(c.Request().Header.ContentType()) == "application/json" {
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		if input.Nickname != "" { profile.Nickname = input.Nickname }
		if input.Bio != "" { profile.Bio = input.Bio }
		if input.CurrentStatus != "" { profile.CurrentStatus = input.CurrentStatus }
		if input.SocialLinks != "" { profile.SocialLinks = input.SocialLinks }
		if input.TechStack != "" { profile.TechStack = input.TechStack }
		if input.AvatarURL != "" { profile.AvatarURL = input.AvatarURL }
	} else {
		if nickname := c.FormValue("nickname"); nickname != "" { profile.Nickname = nickname }
		if bio := c.FormValue("bio"); bio != "" { profile.Bio = bio }
		if status := c.FormValue("current_status"); status != "" { profile.CurrentStatus = status }
		if links := c.FormValue("social_links"); links != "" { profile.SocialLinks = links }
		if stack := c.FormValue("tech_stack"); stack != "" { profile.TechStack = stack }
		if avatarURL := c.FormValue("avatar_url"); avatarURL != "" { profile.AvatarURL = avatarURL }
	}

	// Tangani upload gambar (opsional)
	file, err := c.FormFile("avatar")
	if err == nil && file != nil {
		secureURL, errUpload := services.UploadImageToCloudinary(file)
		if errUpload != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal upload gambar profil: " + errUpload.Error()})
		}
		profile.AvatarURL = secureURL
	}

	database.DB.Save(&profile)
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
