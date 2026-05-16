package routes

import (
	"gamer-hub-api/handlers"
	"gamer-hub-api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Pasang middleware CORS
	r.Use(middleware.CORSMiddleware())

	// Grouping API v1
	api := r.Group("/api")
	{
		// Gallery Routes
		api.GET("/gallery", handlers.GetGalleries)
		api.POST("/gallery", handlers.CreateGallery)

		// Placeholder untuk route lain (Game & Profile)
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})
	}
}
