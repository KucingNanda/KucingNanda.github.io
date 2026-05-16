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
		// Gallery Routes
		api.GET("/gallery", handlers.GetGalleries)

		// Gaming Routes
		api.GET("/games", handlers.GetGames)

		// Profile Routes (Baru)
		api.GET("/profile", handlers.GetProfile)
		api.PUT("/profile", handlers.UpdateProfile)

		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})
	}
}
