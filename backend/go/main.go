package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/evan3v4n/Projectivity/backend/go/graph"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
	"github.com/evan3v4n/Projectivity/backend/go/internal/services"
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

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", defaultPort)
	log.Fatal(http.ListenAndServe(":"+defaultPort, nil))

}
