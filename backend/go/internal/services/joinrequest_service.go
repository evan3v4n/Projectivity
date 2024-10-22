package services

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/evan3v4n/Projectivity/backend/go/graph/model"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
)

type JoinRequestService struct {
	DB *sql.DB
}

func NewJoinRequestService(db *sql.DB) *JoinRequestService {
	return &JoinRequestService{DB: db}
}

func (s *JoinRequestService) CreateJoinRequest(ctx context.Context, projectID, userID string) (*model.JoinRequest, error) {
	log.Printf("Creating join request for user %s to project %s", userID, projectID)

	err := database.RequestToJoinProject(ctx, projectID, userID)
	if err != nil {
		log.Printf("Error in database.RequestToJoinProject: %v", err)
		return nil, fmt.Errorf("failed to create join request: %w", err)
	}

	log.Printf("Join request created successfully in database")

	// Fetch and return the created join request
	joinRequest, err := s.GetJoinRequestByUserAndProject(ctx, userID, projectID)
	if err != nil {
		log.Printf("Error fetching created join request: %v", err)
		return nil, fmt.Errorf("failed to fetch created join request: %w", err)
	}

	log.Printf("Fetched join request: %+v", joinRequest)

	return joinRequest, nil
}

func (s *JoinRequestService) GetJoinRequestByUserAndProject(ctx context.Context, userID, projectID string) (*model.JoinRequest, error) {
	query := `
		SELECT jr.id, jr.status, jr.created_at, 
			   u.id as user_id, u.username, 
			   p.id as project_id, p.title
		FROM join_requests jr
		JOIN users u ON jr.user_id = u.id
		JOIN projects p ON jr.project_id = p.id
		WHERE jr.user_id = $1 AND jr.project_id = $2
	`

	var jr model.JoinRequest
	var user model.User
	var project model.Project

	err := s.DB.QueryRowContext(ctx, query, userID, projectID).Scan(
		&jr.ID, &jr.Status, &jr.CreatedAt,
		&user.ID, &user.Username,
		&project.ID, &project.Title,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get join request: %w", err)
	}

	jr.User = &user
	jr.Project = &project

	return &jr, nil
}

// Add this new method to the JoinRequestService struct

func (s *JoinRequestService) GetJoinRequestsByProject(ctx context.Context, projectID string) ([]*model.JoinRequest, error) {
	query := `
		SELECT jr.id, jr.status, jr.created_at, 
			   u.id as user_id, u.username, 
			   p.id as project_id, p.title
		FROM join_requests jr
		JOIN users u ON jr.user_id = u.id
		JOIN projects p ON jr.project_id = p.id
		WHERE jr.project_id = $1
	`

	rows, err := s.DB.QueryContext(ctx, query, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to query join requests: %w", err)
	}
	defer rows.Close()

	var joinRequests []*model.JoinRequest

	for rows.Next() {
		var jr model.JoinRequest
		var user model.User
		var project model.Project

		err := rows.Scan(
			&jr.ID, &jr.Status, &jr.CreatedAt,
			&user.ID, &user.Username,
			&project.ID, &project.Title,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan join request: %w", err)
		}

		jr.User = &user
		jr.Project = &project

		joinRequests = append(joinRequests, &jr)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating join requests: %w", err)
	}

	return joinRequests, nil
}
