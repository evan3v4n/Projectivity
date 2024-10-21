package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/evan3v4n/Projectivity/backend/go/graph/model"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
	"github.com/google/uuid"
)

type TeamService struct{}

func NewTeamService() *TeamService {
	return &TeamService{}
}

func (s *TeamService) CreateTeam(ctx context.Context, input model.CreateTeamInput) (*model.Team, error) {
	team := &model.Team{
		ID:          uuid.New().String(),
		Name:        input.Name,
		Description: input.Description,
		CreatedAt:   time.Now().Format(time.RFC3339),
		UpdatedAt:   time.Now().Format(time.RFC3339),
	}

	err := database.Transaction(ctx, func(tx *sql.Tx) error {
		query := `INSERT INTO teams (id, name, description, project_id, created_at, updated_at)
				  VALUES ($1, $2, $3, $4, $5, $6)`
		_, err := tx.ExecContext(ctx, query,
			team.ID, team.Name, team.Description, input.ProjectID, team.CreatedAt, team.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert team: %w", err)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return team, nil
}

func (s *TeamService) GetTeamByID(ctx context.Context, id string) (*model.Team, error) {
	query := `
		SELECT t.id, t.name, t.description, t.project_id, t.created_at, t.updated_at,
			   p.title as project_title
		FROM teams t
		JOIN projects p ON t.project_id = p.id
		WHERE t.id = $1
	`

	team := &model.Team{}
	var projectID, projectTitle string

	err := database.QueryRow(ctx, query, id).Scan(
		&team.ID, &team.Name, &team.Description, &projectID, &team.CreatedAt, &team.UpdatedAt,
		&projectTitle,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("team not found")
		}
		return nil, fmt.Errorf("error fetching team: %w", err)
	}

	team.Project = &model.Project{
		ID:    projectID,
		Title: projectTitle,
	}

	return team, nil
}

func (s *TeamService) UpdateTeam(ctx context.Context, id string, input model.UpdateTeamInput) (*model.Team, error) {
	team, err := s.GetTeamByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if input.Name != nil {
		team.Name = *input.Name
	}
	if input.Description != nil {
		team.Description = input.Description
	}
	team.UpdatedAt = time.Now().Format(time.RFC3339)

	err = database.Transaction(ctx, func(tx *sql.Tx) error {
		query := `UPDATE teams SET name = $1, description = $2, updated_at = $3 WHERE id = $4`
		_, err := tx.ExecContext(ctx, query, team.Name, team.Description, team.UpdatedAt, team.ID)
		if err != nil {
			return fmt.Errorf("failed to update team: %w", err)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return team, nil
}

func (s *TeamService) DeleteTeam(ctx context.Context, id string) error {
	query := `DELETE FROM teams WHERE id = $1`
	err := database.ExecuteQuery(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}
	return nil
}

func (s *TeamService) GetTeamMembers(ctx context.Context, teamID string) ([]*model.TeamMember, error) {
	query := `
		SELECT tm.id, tm.user_id, tm.role, tm.joined_at,
			   u.username, u.email, u.first_name, u.last_name
		FROM team_members tm
		JOIN users u ON tm.user_id = u.id
		WHERE tm.team_id = $1
	`

	rows, err := database.Query(ctx, query, teamID)
	if err != nil {
		return nil, fmt.Errorf("failed to query team members: %w", err)
	}
	defer rows.Close()

	var teamMembers []*model.TeamMember
	for rows.Next() {
		tm := &model.TeamMember{
			User: &model.User{},
		}
		err := rows.Scan(
			&tm.ID, &tm.User.ID, &tm.Role, &tm.JoinedAt,
			&tm.User.Username, &tm.User.Email, &tm.User.FirstName, &tm.User.LastName,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan team member row: %w", err)
		}
		teamMembers = append(teamMembers, tm)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating team member rows: %w", err)
	}

	return teamMembers, nil
}

func (s *TeamService) AddTeamMember(ctx context.Context, teamID string, userID string, role string) (*model.TeamMember, error) {
	var newMember *model.TeamMember

	err := database.Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the user is already a member of the team
		checkQuery := `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2`
		var existingID string
		err := tx.QueryRowContext(ctx, checkQuery, teamID, userID).Scan(&existingID)
		if err == nil {
			return fmt.Errorf("user is already a member of this team")
		} else if err != sql.ErrNoRows {
			return fmt.Errorf("error checking existing team membership: %w", err)
		}

		// Add the new team member
		newMember = &model.TeamMember{
			ID:       uuid.New().String(),
			User:     &model.User{ID: userID},
			Role:     role,
			JoinedAt: time.Now().Format(time.RFC3339),
		}

		insertQuery := `
			INSERT INTO team_members (id, team_id, user_id, role, joined_at)
			VALUES ($1, $2, $3, $4, $5)
		`
		_, err = tx.ExecContext(ctx, insertQuery, newMember.ID, teamID, userID, role, newMember.JoinedAt)
		if err != nil {
			return fmt.Errorf("failed to add team member: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return newMember, nil
}

func (s *TeamService) RemoveTeamMember(ctx context.Context, teamID string, userID string) error {
	query := `DELETE FROM team_members WHERE team_id = $1 AND user_id = $2`
	err := database.ExecuteQuery(ctx, query, teamID, userID)
	if err != nil {
		return fmt.Errorf("failed to remove team member: %w", err)
	}
	return nil
}

func (s *TeamService) GetTeamsByProject(ctx context.Context, projectID string) ([]*model.Team, error) {
	query := `
		SELECT id, name, description, created_at, updated_at
		FROM teams
		WHERE project_id = $1
	`

	rows, err := database.Query(ctx, query, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to query teams: %w", err)
	}
	defer rows.Close()

	var teams []*model.Team
	for rows.Next() {
		team := &model.Team{}
		err := rows.Scan(
			&team.ID, &team.Name, &team.Description, &team.CreatedAt, &team.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan team row: %w", err)
		}
		teams = append(teams, team)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating team rows: %w", err)
	}

	return teams, nil
}

func (s *TeamService) UpdateTeamMemberRole(ctx context.Context, teamID string, userID string, newRole string) error {
	query := `
		UPDATE team_members
		SET role = $1
		WHERE team_id = $2 AND user_id = $3
	`
	err := database.ExecuteQuery(ctx, query, newRole, teamID, userID)
	if err != nil {
		return fmt.Errorf("failed to update team member role: %w", err)
	}
	return nil
}
