package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/evan3v4n/Projectivity/backend/go/graph"
	"github.com/evan3v4n/Projectivity/backend/go/internal/auth"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
	"github.com/evan3v4n/Projectivity/backend/go/internal/services"
	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	// Initialize database
	dbConfig := database.Config{
		Host:     "localhost",
		Port:     5432,
		User:     "projectivity_user",
		Password: "Pappydapenguin1!",
		DBName:   "projectivity",
		SSLMode:  "disable",
	}

	db, err := database.Initialize(dbConfig)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	if err := auth.InitJWTSecretKey(); err != nil {
		log.Fatalf("Failed to initialize JWT secret key: %v", err)
	}

	// Initialize services
	userService := services.NewUserService(db)
	taskService := services.NewTaskService(db)
	teamService := services.NewTeamService(db)
	projectService := services.NewProjectService(db, userService)

	// Create resolver with services
	resolver := &graph.Resolver{
		ProjectService: projectService,
		UserService:    userService,
		TaskService:    taskService,
		TeamService:    teamService,
	}

	// Create a new router
	router := chi.NewRouter()

	// Setup CORS
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Add your frontend URL here
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	router.Use(corsMiddleware.Handler)

	// Create GraphQL handler
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	// Setup routes
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", auth.AuthMiddleware(srv))

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
