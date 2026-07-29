package handlers

import (
	"encoding/json"
	"net/http"
	"io"

	"github.com/gofiber/fiber/v2"
)

// GetHoyoverseData memanggil Python Microservice dan meneruskan datanya ke Frontend
func GetHoyoverseData(c *fiber.Ctx) error {
	// Menembak endpoint FastAPI Python
	resp, err := http.Get("http://127.0.0.1:8000/api/user")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Gagal terhubung ke Python Microservice",
		})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Gagal membaca response dari Python Microservice",
		})
	}

	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Gagal memparsing JSON",
		})
	}

	// Mengembalikan status yang sama dengan Python API (misal 503 saat caching belum siap)
	return c.Status(resp.StatusCode).JSON(data)
}
