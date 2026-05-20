package handlers

import (
	"gamer-hub-api/database"
	"gamer-hub-api/models"
	"gamer-hub-api/utils"
	"github.com/gofiber/fiber/v2"
)

// GetVaults mengambil daftar kredensial dari database
func GetVaults(c *fiber.Ctx) error {
	var vaults []models.Vault
	result := database.DB.Find(&vaults)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	// Dekripsi password sebelum dikirim ke frontend
	for i := range vaults {
		if vaults[i].Password != "" {
			decrypted, err := utils.DecryptAES(vaults[i].Password)
			// Jika error (misal data lama yang belum dienkripsi), biarkan saja
			if err == nil {
				vaults[i].Password = decrypted
			}
		}
	}

	return c.Status(fiber.StatusOK).JSON(vaults)
}

// CreateVault untuk menambah data kredensial baru
func CreateVault(c *fiber.Ctx) error {
	var input models.Vault
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Enkripsi password
	if input.Password != "" {
		encPwd, err := utils.EncryptAES(input.Password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengenkripsi password"})
		}
		input.Password = encPwd
	}
	database.DB.Create(&input)
	return c.Status(fiber.StatusCreated).JSON(input)
}

// UpdateVault memperbarui data kredensial berdasarkan ID
func UpdateVault(c *fiber.Ctx) error {
	id := c.Params("id")
	var vault models.Vault

	if err := database.DB.First(&vault, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Catatan tidak ditemukan"})
	}

	var input models.Vault
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Enkripsi password
	if input.Password != "" {
		encPwd, err := utils.EncryptAES(input.Password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengenkripsi password"})
		}
		input.Password = encPwd
	}

	database.DB.Model(&vault).Updates(input)
	return c.Status(fiber.StatusOK).JSON(vault)
}

// DeleteVault menghapus data kredensial berdasarkan ID
func DeleteVault(c *fiber.Ctx) error {
	id := c.Params("id")
	var vault models.Vault

	if err := database.DB.First(&vault, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Catatan tidak ditemukan"})
	}

	database.DB.Delete(&vault)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Catatan berhasil dihapus"})
}
