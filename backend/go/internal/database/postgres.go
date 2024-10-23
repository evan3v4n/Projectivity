package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// Initialize sets up the database connection
func Initialize(config Config) (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s", config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode)

	var err error
	DB, err = sql.Open("postgres", connStr)

	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v", err)
	}

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := DB.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	log.Println("Connected to database")
	return DB, nil
}

func Close() {
	if DB != nil {
		DB.Close()
	}
}

// Transaction executes a functionm within a database transaction
func Transaction(ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := DB.BeginTx(ctx, nil)

	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}

	err = fn(tx)

	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit()
}

// ExecuteQuery executes a query that returns no rows
func ExecuteQuery(ctx context.Context, query string, args ...interface{}) error {
	_, err := DB.ExecContext(ctx, query, args...)
	return err
}

// QueryRow executes a query that returns a single row
func QueryRow(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return DB.QueryRowContext(ctx, query, args...)
}

// Query executes a query that returns rows
func Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return DB.QueryContext(ctx, query, args...)
}

// JoinProject adds a user to a project and decreases the open positions
func JoinProject(ctx context.Context, projectID, userID string) error {
	return Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the project exists and has open positions
		var openPositions int
		var teamID string
		err := tx.QueryRowContext(ctx, "SELECT open_positions, team_id FROM projects WHERE id = $1", projectID).Scan(&openPositions, &teamID)
		if err != nil {
			return fmt.Errorf("failed to get project: %v", err)
		}
		if openPositions <= 0 {
			return fmt.Errorf("no open positions available")
		}

		// Check if the user is already a member
		var count int
		err = tx.QueryRowContext(ctx, "SELECT COUNT(*) FROM team_members WHERE team_id = $1 AND user_id = $2", teamID, userID).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to check team membership: %v", err)
		}
		if count > 0 {
			return fmt.Errorf("user is already a team member")
		}

		// Add the user to the team
		_, err = tx.ExecContext(ctx, "INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)", teamID, userID, "Member")
		if err != nil {
			return fmt.Errorf("failed to add team member: %v", err)
		}

		// Decrease open positions
		_, err = tx.ExecContext(ctx, "UPDATE projects SET open_positions = open_positions - 1 WHERE id = $1", projectID)
		if err != nil {
			return fmt.Errorf("failed to update open positions: %v", err)
		}

		return nil
	})
}

// RequestToJoinProject creates a new join request for a project
func RequestToJoinProject(ctx context.Context, projectID, userID string) error {
	log.Printf("Executing RequestToJoinProject for user %s to project %s", userID, projectID)

	return Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the project exists
		var exists bool
		err := tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM projects WHERE id = $1)", projectID).Scan(&exists)
		if err != nil {
			log.Printf("Error checking project existence: %v", err)
			return fmt.Errorf("failed to check project existence: %v", err)
		}
		if !exists {
			log.Printf("Project %s not found", projectID)
			return fmt.Errorf("project not found")
		}

		// Check if a request already exists
		err = tx.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM join_requests WHERE project_id = $1 AND user_id = $2)", projectID, userID).Scan(&exists)
		if err != nil {
			log.Printf("Error checking existing request: %v", err)
			return fmt.Errorf("failed to check existing request: %v", err)
		}
		if exists {
			log.Printf("Join request already exists for user %s to project %s", userID, projectID)
			return fmt.Errorf("join request already exists")
		}

		// Create the join request
		_, err = tx.ExecContext(ctx, "INSERT INTO join_requests (project_id, user_id, status) VALUES ($1, $2, $3)", projectID, userID, "PENDING")
		if err != nil {
			log.Printf("Error creating join request: %v", err)
			return fmt.Errorf("failed to create join request: %v", err)
		}

		log.Printf("Join request created successfully in database")
		return nil
	})
}
