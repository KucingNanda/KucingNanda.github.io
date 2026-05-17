package routes

import (
	"gamer-hub-api/handlers"
	"gamer-hub-api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	{
		// Public Routes
		api.POST("/login", handlers.Login)
		api.GET("/gallery", handlers.GetGalleries)
		api.GET("/games", handlers.GetGames)
		api.GET("/profile", handlers.GetProfile)
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/gallery", handlers.CreateGallery)
			protected.PUT("/gallery/:id", handlers.UpdateGallery)
			protected.DELETE("/gallery/:id", handlers.DeleteGallery)

			protected.POST("/games", handlers.CreateGame)
			protected.PUT("/games/:id", handlers.UpdateGame)
			protected.DELETE("/games/:id", handlers.DeleteGame)

			protected.POST("/profile", handlers.CreateProfile)
			protected.PUT("/profile", handlers.UpdateProfile)
			protected.DELETE("/profile", handlers.DeleteProfile)
		}
	}
}
