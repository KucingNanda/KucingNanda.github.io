package routes

import (
	"gamer-hub-api/handlers"
	"gamer-hub-api/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Use(middleware.CORSMiddleware())

	api := app.Group("/api")
	
	// Public Routes
	api.Post("/login", handlers.Login)
	api.Get("/gallery", handlers.GetGalleries)
	api.Get("/games", handlers.GetGames)
	api.Get("/profile", handlers.GetProfile)
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{"message": "pong"})
	})

	// Protected Routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	
	protected.Post("/gallery", handlers.CreateGallery)
	protected.Put("/gallery/:id", handlers.UpdateGallery)
	protected.Delete("/gallery/:id", handlers.DeleteGallery)

	protected.Post("/games", handlers.CreateGame)
	protected.Put("/games/:id", handlers.UpdateGame)
	protected.Delete("/games/:id", handlers.DeleteGame)

	protected.Post("/profile", handlers.CreateProfile)
	protected.Put("/profile", handlers.UpdateProfile)
	protected.Delete("/profile", handlers.DeleteProfile)

	protected.Get("/vault", handlers.GetVaults)
	protected.Post("/vault", handlers.CreateVault)
	protected.Put("/vault/:id", handlers.UpdateVault)
	protected.Delete("/vault/:id", handlers.DeleteVault)
}
