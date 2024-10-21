package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/codegen/testserver/nullabledirectives/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/evan3v4n/Projectivity/backend/go/graph"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
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

	if err := database.Initialize(dbConfig); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	defer database.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	resolver := &graph.Resolver{}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

}
