package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"go-srhl7/internal/api"
	"go-srhl7/internal/factories"
)

func ApiMiddleware(cf *factories.ConnectionFactory) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("cf", cf)
		c.Next()
	}
}

func main() {
	router := gin.Default()
	connectionFactory := factories.ConnectionFactory{}
	connectionFactory.Init()
	router.Use(ApiMiddleware(&connectionFactory))

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{http.MethodGet, http.MethodPatch, http.MethodPost, http.MethodHead, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"Content-Type", "X-XSRF-TOKEN", "Accept", "Origin", "X-Requested-With", "Referer", "User-Agent", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	router.Static("/ui", "./dist")
	router.NoRoute(func(c *gin.Context) {
		c.File("./dist/index.html")
	})
	group := router.Group("/api")
	{
		api.RegisterClientRoutes(group)
		api.RegisterConnectionRoutes(group)
		api.RegisterSegmentRoutes(group)
		api.RegisterTempalteRoutes(group)
	}
	router.Run()
}
