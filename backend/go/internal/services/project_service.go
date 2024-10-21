package services

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/evan3v4n/Projectivity/backend/go/graph/model"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type ProjectService struct {
	UserService *UserService
}

func NewProjectService(userService *UserService) *ProjectService {
	return &ProjectService{
		UserService: userService,
	}
}

func (s *ProjectService) CreateProject(ctx context.Context, input model.CreateProjectInput, ownerID string) (*model.Project, error) {
	project := &model.Project{
		ID:                 uuid.New().String(),
		Title:              input.Title,
		Description:        input.Description,
		Category:           input.Category,
		Status:             model.ProjectStatusPlanning,
		Technologies:       input.Technologies,
		OpenPositions:      input.OpenPositions,
		TimeCommitment:     input.TimeCommitment,
		LearningObjectives: input.LearningObjectives,
		Popularity:         0,
		Timeline:           "",                    // You might want to set a default value or add it to the input
		TeamMembers:        []*model.TeamMember{}, // Initialize as an empty slice
		CreatedAt:          time.Now().Format(time.RFC3339),
		UpdatedAt:          time.Now().Format(time.RFC3339),
	}

	err := database.Transaction(ctx, func(tx *sql.Tx) error {
		// Save the project to the database
		query := `INSERT INTO projects (id, title, description, category, status, technologies, open_positions, time_commitment, learning_objectives, popularity, created_at, updated_at)
				  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
		_, err := tx.ExecContext(ctx, query,
			project.ID, project.Title, project.Description, project.Category, project.Status,
			pq.Array(project.Technologies), project.OpenPositions, project.TimeCommitment,
			pq.Array(project.LearningObjectives), project.Popularity, project.CreatedAt, project.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert project: %w", err)
		}

		// Set the owner
		ownerQuery := `INSERT INTO project_owners (project_id, user_id) VALUES ($1, $2)`
		_, err = tx.ExecContext(ctx, ownerQuery, project.ID, ownerID)
		if err != nil {
			return fmt.Errorf("failed to set project owner: %w", err)
		}

		// Create a default team for the project
		teamQuery := `INSERT INTO teams (id, name, description, project_id, created_at, updated_at)
					  VALUES ($1, $2, $3, $4, $5, $6)`
		teamID := uuid.New().String()
		teamName := project.Title + " Team"
		teamDescription := "Default team for " + project.Title
		_, err = tx.ExecContext(ctx, teamQuery,
			teamID, teamName, teamDescription, project.ID, time.Now(), time.Now())
		if err != nil {
			return fmt.Errorf("failed to create default team: %w", err)
		}

		// Add the owner as a team member
		teamMemberQuery := `INSERT INTO team_members (user_id, team_id, role, joined_at)
							VALUES ($1, $2, $3, $4)`
		_, err = tx.ExecContext(ctx, teamMemberQuery,
			ownerID, teamID, "Owner", time.Now())
		if err != nil {
			return fmt.Errorf("failed to add owner as team member: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Fetch the owner details
	owner, err := s.UserService.GetUserByID(ctx, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch owner details: %w", err)
	}
	project.Owner = owner

	return project, nil
}

func (s *ProjectService) GetProjectByID(ctx context.Context, id string) (*model.Project, error) {
	query := `
		SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, 
			   p.open_positions, p.time_commitment, p.learning_objectives, p.popularity, 
			   p.created_at, p.updated_at, u.id, u.username, u.email
		FROM projects p
		JOIN project_owners po ON p.id = po.project_id
		JOIN users u ON po.user_id = u.id
		WHERE p.id = $1
	`

	project := &model.Project{}
	owner := &model.User{}

	var technologies, learningObjectives []string

	err := database.QueryRow(ctx, query, id).Scan(
		&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
		pq.Array(&technologies), &project.OpenPositions, &project.TimeCommitment,
		pq.Array(&learningObjectives), &project.Popularity, &project.CreatedAt, &project.UpdatedAt,
		&owner.ID, &owner.Username, &owner.Email,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("project not found")
		}
		return nil, fmt.Errorf("error fetching project: %w", err)
	}

	project.Technologies = technologies
	project.LearningObjectives = learningObjectives
	project.Owner = owner

	// Fetch the team for the project
	teamQuery := `
		SELECT t.id, t.name, t.description
		FROM teams t
		WHERE t.project_id = $1
	`
	team := &model.Team{}
	err = database.QueryRow(ctx, teamQuery, id).Scan(
		&team.ID, &team.Name, &team.Description,
	)
	if err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("error fetching team: %w", err)
	}
	project.Team = team

	return project, nil
}

func (s *ProjectService) UpdateProject(ctx context.Context, id string, input model.UpdateProjectInput) (*model.Project, error) {
	// First, retrieve the existing project
	project, err := s.GetProjectByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve project: %w", err)
	}

	// Update fields if provided in input
	if input.Title != nil {
		project.Title = *input.Title
	}
	if input.Description != nil {
		project.Description = *input.Description
	}
	if input.Category != nil {
		project.Category = *input.Category
	}
	if input.Status != nil {
		project.Status = *input.Status
	}
	if input.OpenPositions != nil {
		project.OpenPositions = *input.OpenPositions
	}
	if input.TimeCommitment != nil {
		project.TimeCommitment = *input.TimeCommitment
	}
	if input.LearningObjectives != nil {
		project.LearningObjectives = input.LearningObjectives
	}

	project.UpdatedAt = time.Now().Format(time.RFC3339)

	// Update the project in the database
	err = database.Transaction(ctx, func(tx *sql.Tx) error {
		query := `
			UPDATE projects
			SET title = $1, description = $2, category = $3, status = $4, 
				open_positions = $5, time_commitment = $6, 
				learning_objectives = $7, updated_at = $8
			WHERE id = $9
		`
		_, err := tx.ExecContext(ctx, query,
			project.Title, project.Description, project.Category, project.Status,
			project.OpenPositions, project.TimeCommitment,
			pq.Array(project.LearningObjectives), project.UpdatedAt, project.ID)

		if err != nil {
			return fmt.Errorf("failed to update project: %w", err)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return project, nil
}

func (s *ProjectService) DeleteProject(ctx context.Context, id string) error {
	// Delete the project from the database
	// Return an error if the operation fails

	query := `DELETE FROM projects WHERE id = $1`

	err := database.ExecuteQuery(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}

	return errors.New("not implemented")
}

func (s *ProjectService) ListProjects(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*model.Project, error) {
	query := `
		SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, 
			p.open_positions, p.time_commitment, p.learning_objectives, p.popularity, 
			p.timeline, p.created_at, p.updated_at,
			u.id, u.username, u.email
		FROM projects p
		JOIN project_owners po ON p.id = po.project_id
		JOIN users u ON po.user_id = u.id
		WHERE 1=1
	`

	var args []interface{}
	argIndex := 1

	// Add filters to the query
	for key, value := range filters {
		query += fmt.Sprintf(" AND p.%s = $%d", key, argIndex)
		args = append(args, value)
		argIndex++
	}

	// Add ORDER BY, LIMIT, and OFFSET
	query += fmt.Sprintf(" ORDER BY p.created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := database.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query projects: %w", err)
	}
	defer rows.Close()

	var projects []*model.Project
	for rows.Next() {
		project := &model.Project{}
		owner := &model.User{}
		var technologies, learningObjectives []string

		err := rows.Scan(
			&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
			pq.Array(&technologies), &project.OpenPositions, &project.TimeCommitment,
			pq.Array(&learningObjectives), &project.Popularity, &project.Timeline,
			&project.CreatedAt, &project.UpdatedAt,
			&owner.ID, &owner.Username, &owner.Email,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan project row: %w", err)
		}

		project.Technologies = technologies
		project.LearningObjectives = learningObjectives
		project.Owner = owner

		projects = append(projects, project)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating project rows: %w", err)
	}

	return projects, nil
}

func (s *ProjectService) AddTeamMember(ctx context.Context, projectID, userID string, role string) error {
	return database.Transaction(ctx, func(tx *sql.Tx) error {
		// Get the team ID for the project
		teamQuery := "SELECT id FROM teams WHERE project_id = $1"
		var teamID string
		err := tx.QueryRowContext(ctx, teamQuery, projectID).Scan(&teamID)
		if err != nil {
			return fmt.Errorf("error fetching team for project: %w", err)
		}

		// Check if the project exists
		projectExistsQuery := "SELECT id FROM projects WHERE id = $1"
		var projectIDCheck string
		err = tx.QueryRowContext(ctx, projectExistsQuery, projectID).Scan(&projectIDCheck)
		if err == sql.ErrNoRows {
			return fmt.Errorf("project with ID %s does not exist", projectID)
		} else if err != nil {
			return fmt.Errorf("error checking project existence: %w", err)
		}

		// Check if the user exists
		userExistsQuery := "SELECT id FROM users WHERE id = $1"
		var userIDCheck string
		err = tx.QueryRowContext(ctx, userExistsQuery, userID).Scan(&userIDCheck)
		if err == sql.ErrNoRows {
			return fmt.Errorf("user with ID %s does not exist", userID)
		} else if err != nil {
			return fmt.Errorf("error checking user existence: %w", err)
		}

		// Check if the user is already a team member
		checkMemberQuery := "SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2"
		var memberID string
		err = tx.QueryRowContext(ctx, checkMemberQuery, teamID, userID).Scan(&memberID)
		if err == nil {
			return fmt.Errorf("user is already a team member of this project")
		} else if err != sql.ErrNoRows {
			return fmt.Errorf("error checking existing team membership: %w", err)
		}

		// Add the new team member
		insertQuery := `
			INSERT INTO team_members (team_id, user_id, role, joined_at)
			VALUES ($1, $2, $3, $4)
		`
		_, err = tx.ExecContext(ctx, insertQuery, teamID, userID, role, time.Now().UTC())
		if err != nil {
			return fmt.Errorf("failed to add team member: %w", err)
		}

		return nil
	})
}

func (s *ProjectService) RemoveTeamMember(ctx context.Context, projectID, userID string) error {
	return database.Transaction(ctx, func(tx *sql.Tx) error {
		// Get the team ID for the project
		teamQuery := "SELECT id FROM teams WHERE project_id = $1"
		var teamID string
		err := tx.QueryRowContext(ctx, teamQuery, projectID).Scan(&teamID)
		if err != nil {
			return fmt.Errorf("error fetching team for project: %w", err)
		}

		// Check if the team member exists
		checkMemberQuery := `
			SELECT id FROM team_members 
			WHERE team_id = $1 AND user_id = $2
		`
		var memberID string
		err = tx.QueryRowContext(ctx, checkMemberQuery, teamID, userID).Scan(&memberID)
		if err == sql.ErrNoRows {
			return fmt.Errorf("user is not a team member of this project")
		} else if err != nil {
			return fmt.Errorf("error checking team membership: %w", err)
		}

		// Remove the team member
		deleteQuery := `
			DELETE FROM team_members 
			WHERE team_id = $1 AND user_id = $2
		`
		result, err := tx.ExecContext(ctx, deleteQuery, teamID, userID)
		if err != nil {
			return fmt.Errorf("failed to remove team member: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("error checking rows affected: %w", err)
		}

		if rowsAffected == 0 {
			return fmt.Errorf("no team member was removed")
		}

		return nil
	})
}

func (s *ProjectService) UpdateProjectStatus(ctx context.Context, projectID string, status model.ProjectStatus) error {
	return database.Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the project exists
		checkProjectQuery := `SELECT id FROM projects WHERE id = $1`
		var projectIDCheck string
		err := tx.QueryRowContext(ctx, checkProjectQuery, projectID).Scan(&projectIDCheck)
		if err == sql.ErrNoRows {
			return fmt.Errorf("project with ID %s does not exist", projectID)
		} else if err != nil {
			return fmt.Errorf("error checking project existence: %w", err)
		}

		// Update the project status
		updateQuery := `UPDATE projects SET status = $1, updated_at = $2 WHERE id = $3`
		result, err := tx.ExecContext(ctx, updateQuery, status, time.Now().UTC(), projectID)
		if err != nil {
			return fmt.Errorf("failed to update project status: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("error checking rows affected: %w", err)
		}

		if rowsAffected == 0 {
			return fmt.Errorf("no project was updated")
		}

		return nil
	})
}

func (s *ProjectService) GetProjectTeamMembers(ctx context.Context, projectID string) ([]*model.TeamMember, error) {
	query := `
		SELECT tm.id, tm.user_id, tm.role, tm.joined_at,
			   u.username, u.email, u.first_name, u.last_name
		FROM team_members tm
		JOIN users u ON tm.user_id = u.id
		JOIN teams t ON tm.team_id = t.id
		WHERE t.project_id = $1
	`

	rows, err := database.Query(ctx, query, projectID)
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

func (s *ProjectService) SearchProjects(ctx context.Context, query string, limit, offset int) ([]*model.Project, error) {
	searchQuery := `
        SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, 
               p.open_positions, p.time_commitment, p.learning_objectives, p.popularity, 
               p.timeline, p.created_at, p.updated_at,
               u.id AS owner_id, u.username AS owner_username, u.email AS owner_email
        FROM projects p
        JOIN project_owners po ON p.id = po.project_id
        JOIN users u ON po.user_id = u.id
        WHERE to_tsvector('english', p.title || ' ' || p.description || ' ' || p.category) @@ plainto_tsquery('english', $1)
        ORDER BY ts_rank(to_tsvector('english', p.title || ' ' || p.description || ' ' || p.category), plainto_tsquery('english', $1)) DESC
        LIMIT $2 OFFSET $3
    `

	rows, err := database.Query(ctx, searchQuery, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to execute search query: %w", err)
	}
	defer rows.Close()

	var projects []*model.Project
	for rows.Next() {
		project := &model.Project{
			Owner: &model.User{},
		}
		var technologies, learningObjectives []string

		err := rows.Scan(
			&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
			pq.Array(&technologies), &project.OpenPositions, &project.TimeCommitment,
			pq.Array(&learningObjectives), &project.Popularity, &project.Timeline,
			&project.CreatedAt, &project.UpdatedAt,
			&project.Owner.ID, &project.Owner.Username, &project.Owner.Email,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan project row: %w", err)
		}

		project.Technologies = technologies
		project.LearningObjectives = learningObjectives

		projects = append(projects, project)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating project rows: %w", err)
	}

	return projects, nil
}

func (s *ProjectService) GetProjectsByOwner(ctx context.Context, ownerID string) ([]*model.Project, error) {
	query := `
        SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, 
               p.open_positions, p.time_commitment, p.learning_objectives, p.popularity, 
               p.timeline, p.created_at, p.updated_at
        FROM projects p
        JOIN project_owners po ON p.id = po.project_id
        WHERE po.user_id = $1
        ORDER BY p.created_at DESC
    `

	rows, err := database.Query(ctx, query, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query projects: %w", err)
	}
	defer rows.Close()

	var projects []*model.Project
	for rows.Next() {
		project := &model.Project{}
		var technologies, learningObjectives []string

		err := rows.Scan(
			&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
			pq.Array(&technologies), &project.OpenPositions, &project.TimeCommitment,
			pq.Array(&learningObjectives), &project.Popularity, &project.Timeline,
			&project.CreatedAt, &project.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan project row: %w", err)
		}

		project.Technologies = technologies
		project.LearningObjectives = learningObjectives

		// Set the owner (we already know the owner ID)
		project.Owner = &model.User{ID: ownerID}

		projects = append(projects, project)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating project rows: %w", err)
	}

	// If no projects found, return an empty slice instead of nil
	if len(projects) == 0 {
		return []*model.Project{}, nil
	}

	return projects, nil
}

func (s *ProjectService) UpdateProjectPopularity(ctx context.Context, projectID string, popularityChange int) error {
	return database.Transaction(ctx, func(tx *sql.Tx) error {
		// First, check if the project exists
		checkProjectQuery := `SELECT popularity FROM projects WHERE id = $1`
		var currentPopularity int
		err := tx.QueryRowContext(ctx, checkProjectQuery, projectID).Scan(&currentPopularity)
		if err == sql.ErrNoRows {
			return fmt.Errorf("project with ID %s does not exist", projectID)
		} else if err != nil {
			return fmt.Errorf("error checking project existence: %w", err)
		}

		// Calculate new popularity
		newPopularity := currentPopularity + popularityChange

		// Ensure popularity doesn't go below 0
		if newPopularity < 0 {
			newPopularity = 0
		}

		// Update the project popularity
		updateQuery := `UPDATE projects SET popularity = $1, updated_at = $2 WHERE id = $3`
		result, err := tx.ExecContext(ctx, updateQuery, newPopularity, time.Now().UTC(), projectID)
		if err != nil {
			return fmt.Errorf("failed to update project popularity: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("error checking rows affected: %w", err)
		}

		if rowsAffected == 0 {
			return fmt.Errorf("no project was updated")
		}

		return nil
	})
}

func (s *ProjectService) GetRelatedProjects(ctx context.Context, projectID string, limit int) ([]*model.Project, error) {
	// First, get the current project's details
	currentProject, err := s.GetProjectByID(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get current project: %w", err)
	}

	query := `
		SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, 
			   p.open_positions, p.time_commitment, p.learning_objectives, p.popularity, 
			   p.timeline, p.created_at, p.updated_at,
			   u.id AS owner_id, u.username AS owner_username, u.email AS owner_email,
			   COUNT(DISTINCT t) AS matching_technologies
		FROM projects p
		JOIN project_owners po ON p.id = po.project_id
		JOIN users u ON po.user_id = u.id
		LEFT JOIN LATERAL unnest(p.technologies) t ON TRUE
		WHERE p.id != $1
		  AND (p.category = $2 OR t = ANY($3))
		GROUP BY p.id, u.id
		ORDER BY matching_technologies DESC, p.popularity DESC
		LIMIT $4
	`

	rows, err := database.Query(ctx, query, projectID, currentProject.Category, pq.Array(currentProject.Technologies), limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query related projects: %w", err)
	}
	defer rows.Close()

	var relatedProjects []*model.Project
	for rows.Next() {
		project := &model.Project{
			Owner: &model.User{},
		}
		var technologies, learningObjectives []string
		var matchingTechnologies int

		err := rows.Scan(
			&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
			pq.Array(&technologies), &project.OpenPositions, &project.TimeCommitment,
			pq.Array(&learningObjectives), &project.Popularity, &project.Timeline,
			&project.CreatedAt, &project.UpdatedAt,
			&project.Owner.ID, &project.Owner.Username, &project.Owner.Email,
			&matchingTechnologies,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan related project row: %w", err)
		}

		project.Technologies = technologies
		project.LearningObjectives = learningObjectives

		relatedProjects = append(relatedProjects, project)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating related project rows: %w", err)
	}

	return relatedProjects, nil
}

func (s *ProjectService) AddTechnology(ctx context.Context, projectID string, technology string) (*model.Project, error) {
	err := database.Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the project exists
		checkProjectQuery := `SELECT id FROM projects WHERE id = $1`
		var projectIDCheck string
		err := tx.QueryRowContext(ctx, checkProjectQuery, projectID).Scan(&projectIDCheck)
		if err == sql.ErrNoRows {
			return fmt.Errorf("project with ID %s does not exist", projectID)
		} else if err != nil {
			return fmt.Errorf("error checking project existence: %w", err)
		}

		// Add the technology to the array
		updateQuery := `
			UPDATE projects 
			SET technologies = array_append(technologies, $1),
				updated_at = $2
			WHERE id = $3 AND NOT ($1 = ANY(technologies))
		`
		result, err := tx.ExecContext(ctx, updateQuery, technology, time.Now().UTC(), projectID)
		if err != nil {
			return fmt.Errorf("failed to add technology: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("error checking rows affected: %w", err)
		}

		if rowsAffected == 0 {
			return fmt.Errorf("technology already exists or project not found")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Fetch and return the updated project
	return s.GetProjectByID(ctx, projectID)
}

func (s *ProjectService) RemoveTechnology(ctx context.Context, projectID string, technology string) (*model.Project, error) {
	err := database.Transaction(ctx, func(tx *sql.Tx) error {
		// Check if the project exists
		checkProjectQuery := `SELECT id FROM projects WHERE id = $1`
		var projectIDCheck string
		err := tx.QueryRowContext(ctx, checkProjectQuery, projectID).Scan(&projectIDCheck)
		if err == sql.ErrNoRows {
			return fmt.Errorf("project with ID %s does not exist", projectID)
		} else if err != nil {
			return fmt.Errorf("error checking project existence: %w", err)
		}

		// Remove the technology from the array
		updateQuery := `
			UPDATE projects 
			SET technologies = array_remove(technologies, $1),
				updated_at = $2
			WHERE id = $3 AND $1 = ANY(technologies)
		`
		result, err := tx.ExecContext(ctx, updateQuery, technology, time.Now().UTC(), projectID)
		if err != nil {
			return fmt.Errorf("failed to remove technology: %w", err)
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("error checking rows affected: %w", err)
		}

		if rowsAffected == 0 {
			return fmt.Errorf("technology not found in project or project not found")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Fetch and return the updated project
	return s.GetProjectByID(ctx, projectID)
}
