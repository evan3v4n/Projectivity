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

// Sets up the databse connection
func Initialize(config Config) error {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s", config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode)

	var err error
	DB, err = sql.Open("postgres", connStr)

	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := DB.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	log.Println("Connected to databse")
	return nil
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
