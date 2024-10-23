package services

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

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

func (s *JoinRequestService) ApproveJoinRequest(ctx context.Context, requestID, approverID string) (*model.JoinRequest, error) {
	return s.updateJoinRequestStatus(ctx, requestID, approverID, model.JoinRequestStatusApproved)
}

func (s *JoinRequestService) DenyJoinRequest(ctx context.Context, requestID string, userID string) (*model.JoinRequest, error) {
	// Start a transaction
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// Get the join request
	joinRequest, err := s.getJoinRequestByID(ctx, tx, requestID)
	if err != nil {
		return nil, fmt.Errorf("failed to get join request: %w", err)
	}

	// Check if the user is the project owner
	isOwner, err := s.isProjectOwner(ctx, tx, joinRequest.Project.ID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to check project ownership: %w", err)
	}
	if !isOwner {
		return nil, fmt.Errorf("unauthorized: only the project owner can deny join requests")
	}

	// Update the join request status to REJECTED
	query := `UPDATE join_requests SET status = $1 WHERE id = $2`
	_, err = tx.ExecContext(ctx, query, model.JoinRequestStatusRejected, requestID)
	if err != nil {
		return nil, fmt.Errorf("failed to update join request status: %w", err)
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Fetch and return the updated join request
	updatedJoinRequest, err := s.GetJoinRequestByID(ctx, requestID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch updated join request: %w", err)
	}

	return updatedJoinRequest, nil
}

func (s *JoinRequestService) updateJoinRequestStatus(ctx context.Context, requestID, userID string, status model.JoinRequestStatus) (*model.JoinRequest, error) {
	log.Printf("Updating join request status: requestID=%s, userID=%s, status=%s", requestID, userID, status)

	// Start a transaction
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// Get the join request
	joinRequest, err := s.getJoinRequestByID(ctx, tx, requestID)
	if err != nil {
		log.Printf("Error getting join request: %v", err)
		return nil, err
	}
	log.Printf("Retrieved join request: %+v", joinRequest)

	// Check if the user is the project owner
	isOwner, err := s.isProjectOwner(ctx, tx, joinRequest.Project.ID, userID)
	if err != nil {
		log.Printf("Error checking project ownership: %v", err)
		return nil, err
	}
	if !isOwner {
		log.Printf("Unauthorized: user %s is not the owner of project %s", userID, joinRequest.Project.ID)
		return nil, fmt.Errorf("unauthorized: user is not the project owner")
	}

	// Update the join request status
	query := `UPDATE join_requests SET status = $1 WHERE id = $2`
	_, err = tx.ExecContext(ctx, query, status, requestID)
	if err != nil {
		log.Printf("Error updating join request status: %v", err)
		return nil, fmt.Errorf("failed to update join request status: %w", err)
	}
	log.Printf("Updated join request status to %s", status)

	// If approved, add the user to the project team
	if status == model.JoinRequestStatusApproved {
		err = s.addUserToProject(ctx, tx, joinRequest.Project.ID, joinRequest.User.ID)
		if err != nil {
			log.Printf("Error adding user to project: %v", err)
			return nil, err
		}
		log.Printf("Added user %s to project %s", joinRequest.User.ID, joinRequest.Project.ID)
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	log.Printf("Transaction committed successfully")

	// Return the updated join request
	updatedJoinRequest, err := s.GetJoinRequestByID(ctx, requestID)
	if err != nil {
		log.Printf("Error fetching updated join request: %v", err)
		return nil, fmt.Errorf("failed to fetch updated join request: %w", err)
	}
	log.Printf("Retrieved updated join request: %+v", updatedJoinRequest)

	return updatedJoinRequest, nil
}

func (s *JoinRequestService) getJoinRequestByID(ctx context.Context, tx *sql.Tx, requestID string) (*model.JoinRequest, error) {
	query := `
		SELECT jr.id, jr.status, jr.created_at, 
			   u.id as user_id, u.username, 
			   p.id as project_id, p.title
		FROM join_requests jr
		JOIN users u ON jr.user_id = u.id
		JOIN projects p ON jr.project_id = p.id
		WHERE jr.id = $1
	`

	var jr model.JoinRequest
	var user model.User
	var project model.Project

	err := tx.QueryRowContext(ctx, query, requestID).Scan(
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

func (s *JoinRequestService) isProjectOwner(ctx context.Context, tx *sql.Tx, projectID, userID string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM project_owners WHERE project_id = $1 AND user_id = $2)`
	var isOwner bool
	err := tx.QueryRowContext(ctx, query, projectID, userID).Scan(&isOwner)
	if err != nil {
		return false, fmt.Errorf("failed to check project ownership: %w", err)
	}
	return isOwner, nil
}

func (s *JoinRequestService) addUserToProject(ctx context.Context, tx *sql.Tx, projectID, userID string) error {
	log.Printf("Attempting to add user %s to project %s", userID, projectID)

	// First, get the team_id for the project
	var teamID string
	err := tx.QueryRowContext(ctx, "SELECT id FROM teams WHERE project_id = $1", projectID).Scan(&teamID)
	if err != nil {
		log.Printf("Error getting team_id for project: %v", err)
		return fmt.Errorf("failed to get team_id for project: %w", err)
	}

	// Insert the user into the team_members table
	query := `INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES ($1, $2, $3, $4)`
	_, err = tx.ExecContext(ctx, query, teamID, userID, "Member", time.Now())
	if err != nil {
		log.Printf("Error adding user to project team: %v", err)
		return fmt.Errorf("failed to add user to project team: %w", err)
	}

	log.Printf("Successfully added user %s to project %s (team_id: %s)", userID, projectID, teamID)
	return nil
}

func (s *JoinRequestService) GetJoinRequestByID(ctx context.Context, requestID string) (*model.JoinRequest, error) {
	query := `
		SELECT jr.id, jr.status, jr.created_at, 
			   u.id as user_id, u.username, 
			   p.id as project_id, p.title
		FROM join_requests jr
		JOIN users u ON jr.user_id = u.id
		JOIN projects p ON jr.project_id = p.id
		WHERE jr.id = $1
	`

	var jr model.JoinRequest
	var user model.User
	var project model.Project

	err := s.DB.QueryRowContext(ctx, query, requestID).Scan(
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
