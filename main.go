package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"go-srhl7/internal/api"
	"go-srhl7/internal/factories"

	"github.com/judwhite/go-svc"
)

// program implements svc.Service
type program struct {
	wg   sync.WaitGroup
	quit chan struct{}
}

func ApiMiddleware(cf *factories.ConnectionFactory) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("cf", cf)
		c.Next()
	}
}

func main() {
	prg := &program{}

	// Call svc.Run to start your program/service.
	if err := svc.Run(prg); err != nil {
		log.Fatal(err)
	}
}

func (p *program) Init(env svc.Environment) error {
	log.Printf("is win service? %v\n", env.IsWindowsService())
	return nil
}

func (p *program) Start() error {
	p.quit = make(chan struct{})

	p.wg.Add(1)
	go func() {
		log.Println("Starting...")
		srv := mainLoop()
		<-p.quit
		log.Println("Quit signal received...")
		shutDownWebServer(srv)
		p.wg.Done()
	}()

	return nil
}

func (p *program) Stop() error {
	log.Println("Stopping...")
	close(p.quit)
	p.wg.Wait()
	log.Println("Stopped.")
	return nil
}

func mainLoop() *http.Server {
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

	// Create a HTTP server using the Gin router
	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}
	// Use a go function so we can monitor for the shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("Listen: %s\n", err)
		}
	}()
	return srv
}

func shutDownWebServer(srv *http.Server) {
	// Create a context with timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// Shutdown the server
	if err := srv.Shutdown(ctx); err != nil {
		fmt.Printf("Server shutdown error: %v\n", err)
	}
}
