package services

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/evan3v4n/Projectivity/backend/go/graph/model"
	"github.com/evan3v4n/Projectivity/backend/go/internal/database"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	DB *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{DB: db}
}

func (s *UserService) CreateUser(ctx context.Context, input model.CreateUserInput) (*model.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Username:        input.Username,
		Email:           input.Email,
		FirstName:       input.FirstName,
		LastName:        input.LastName,
		Skills:          input.Skills,
		YearsExperience: input.YearsExperience,
		EmailVerified:   false,
		LastActive:      time.Now().Format(time.RFC3339),
		Projects:        []*model.Project{},
		OwnedProjects:   []*model.Project{},
		JoinedAt:        time.Now().Format(time.RFC3339),
		CreatedAt:       time.Now().Format(time.RFC3339),
		UpdatedAt:       time.Now().Format(time.RFC3339),
	}

	// Optional Fields
	user.Bio = input.Bio
	user.ProfileImageURL = nil // Set a default or add to input if needed
	user.EducationLevel = input.EducationLevel
	user.PreferredRole = input.PreferredRole
	user.GithubURL = input.GithubURL
	user.LinkedInURL = input.LinkedInURL
	user.PortfolioURL = input.PortfolioURL
	user.TimeZone = input.TimeZone
	user.AvailableHours = input.AvailableHours
	user.Certifications = input.Certifications
	user.Languages = input.Languages
	user.ProjectPreferences = input.ProjectPreferences

	err = database.Transaction(ctx, func(tx *sql.Tx) error {
		query := `
			INSERT INTO users (username, email, password_hash, first_name, last_name, bio, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
			RETURNING id
		`

		err := tx.QueryRowContext(ctx, query,
			user.Username, user.Email, hashedPassword, user.FirstName, user.LastName, user.Bio, user.Skills, user.EducationLevel, user.YearsExperience,
			user.PreferredRole, user.GithubURL, user.LinkedInURL, user.PortfolioURL, user.EmailVerified, user.TimeZone, user.AvailableHours,
			user.Certifications, user.Languages, user.ProjectPreferences, user.CreatedAt, user.UpdatedAt,
		).Scan(&user.ID)

		return err
	})

	if err != nil {
		return nil, err
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) GetUserByID(ctx context.Context, id string) (*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, bio, profile_image_url, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, last_active, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	user := &model.User{}
	err := database.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Bio, &user.ProfileImageURL,
		&user.Skills, &user.EducationLevel, &user.YearsExperience, &user.PreferredRole, &user.GithubURL,
		&user.LinkedInURL, &user.PortfolioURL, &user.EmailVerified, &user.LastActive, &user.TimeZone,
		&user.AvailableHours, &user.Certifications, &user.Languages, &user.ProjectPreferences,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}

func (s *UserService) UpdateUser(ctx context.Context, id string, input model.UpdateUserInput) (*model.User, error) {
	user, err := s.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Update fields if provided in input
	if input.Username != nil {
		user.Username = *input.Username
	}
	if input.Email != nil {
		user.Email = *input.Email
	}
	if input.FirstName != nil {
		user.FirstName = *input.FirstName
	}
	if input.LastName != nil {
		user.LastName = *input.LastName
	}
	if input.Bio != nil {
		user.Bio = input.Bio
	}
	if input.ProfileImageURL != nil {
		user.ProfileImageURL = input.ProfileImageURL
	}
	if input.Skills != nil {
		user.Skills = input.Skills
	}
	if input.EducationLevel != nil {
		user.EducationLevel = input.EducationLevel
	}
	if input.YearsExperience != nil {
		user.YearsExperience = *input.YearsExperience
	}
	if input.PreferredRole != nil {
		user.PreferredRole = input.PreferredRole
	}
	if input.GithubURL != nil {
		user.GithubURL = input.GithubURL
	}
	if input.LinkedInURL != nil {
		user.LinkedInURL = input.LinkedInURL
	}
	if input.PortfolioURL != nil {
		user.PortfolioURL = input.PortfolioURL
	}
	if input.TimeZone != nil {
		user.TimeZone = input.TimeZone
	}
	if input.AvailableHours != nil {
		user.AvailableHours = input.AvailableHours
	}
	if input.Certifications != nil {
		user.Certifications = input.Certifications
	}
	if input.Languages != nil {
		user.Languages = input.Languages
	}
	if input.ProjectPreferences != nil {
		user.ProjectPreferences = input.ProjectPreferences
	}

	user.UpdatedAt = time.Now().Format(time.RFC3339)

	err = database.Transaction(ctx, func(tx *sql.Tx) error {
		query := `
			UPDATE users
			SET username = $1, email = $2, first_name = $3, last_name = $4, bio = $5, profile_image_url = $6,
				skills = $7, education_level = $8, years_experience = $9, preferred_role = $10, github_url = $11,
				linkedin_url = $12, portfolio_url = $13, time_zone = $14, available_hours = $15, certifications = $16,
				languages = $17, project_preferences = $18, updated_at = $19
			WHERE id = $20
		`
		_, err := tx.ExecContext(ctx, query,
			user.Username, user.Email, user.FirstName, user.LastName, user.Bio, user.ProfileImageURL,
			user.Skills, user.EducationLevel, user.YearsExperience, user.PreferredRole, user.GithubURL,
			user.LinkedInURL, user.PortfolioURL, user.TimeZone, user.AvailableHours, user.Certifications,
			user.Languages, user.ProjectPreferences, user.UpdatedAt, user.ID,
		)
		return err
	})

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, bio, profile_image_url, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, last_active, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	user := &model.User{}
	err := database.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Bio, &user.ProfileImageURL,
		&user.Skills, &user.EducationLevel, &user.YearsExperience, &user.PreferredRole, &user.GithubURL,
		&user.LinkedInURL, &user.PortfolioURL, &user.EmailVerified, &user.LastActive, &user.TimeZone,
		&user.AvailableHours, &user.Certifications, &user.Languages, &user.ProjectPreferences,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}

func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	err := database.ExecuteQuery(ctx, query, id)
	return err
}

func (s *UserService) VerifyUserEmail(ctx context.Context, id string) error {
	query := `UPDATE users SET email_verified = true WHERE id = $1`
	err := database.ExecuteQuery(ctx, query, id)
	return err
}

func (s *UserService) UpdateLastActive(ctx context.Context, id string) error {
	query := `UPDATE users SET last_active = $1 WHERE id = $2`
	err := database.ExecuteQuery(ctx, query, time.Now().Format(time.RFC3339), id)
	return err
}

func (s *UserService) ListUsers(ctx context.Context, limit, offset int) ([]*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, bio, profile_image_url, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, last_active, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := database.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		user := &model.User{}
		err := rows.Scan(
			&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Bio, &user.ProfileImageURL,
			&user.Skills, &user.EducationLevel, &user.YearsExperience, &user.PreferredRole, &user.GithubURL,
			&user.LinkedInURL, &user.PortfolioURL, &user.EmailVerified, &user.LastActive, &user.TimeZone,
			&user.AvailableHours, &user.Certifications, &user.Languages, &user.ProjectPreferences,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (s *UserService) SearchUsers(ctx context.Context, query string) ([]*model.User, error) {
	sqlQuery := `
		SELECT id, username, email, first_name, last_name, bio, profile_image_url, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, last_active, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at
		FROM users
		WHERE username ILIKE $1 OR email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1 OR skills @> ARRAY[$1] OR project_preferences @> ARRAY[$1]
	`
	rows, err := database.Query(ctx, sqlQuery, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		user := &model.User{}
		err := rows.Scan(
			&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Bio, &user.ProfileImageURL,
			&user.Skills, &user.EducationLevel, &user.YearsExperience, &user.PreferredRole, &user.GithubURL,
			&user.LinkedInURL, &user.PortfolioURL, &user.EmailVerified, &user.LastActive, &user.TimeZone,
			&user.AvailableHours, &user.Certifications, &user.Languages, &user.ProjectPreferences,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (s *UserService) GetUserProjects(ctx context.Context, userID string) ([]*model.Project, error) {
	query := `
		SELECT p.id, p.title, p.description, p.category, p.status, p.technologies, p.open_positions, p.time_commitment, p.popularity, p.timeline, p.learning_objectives, p.created_at, p.updated_at
		FROM projects p
		JOIN team_members tm ON p.id = tm.project_id
		WHERE tm.user_id = $1
	`
	rows, err := database.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []*model.Project
	for rows.Next() {
		project := &model.Project{}
		err := rows.Scan(
			&project.ID, &project.Title, &project.Description, &project.Category, &project.Status,
			&project.Technologies, &project.OpenPositions, &project.TimeCommitment, &project.Popularity,
			&project.Timeline, &project.LearningObjectives, &project.CreatedAt, &project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}

	return projects, nil
}

func (s *UserService) UpdateUserPassword(ctx context.Context, userID, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	query := `UPDATE users SET password_hash = $1 WHERE id = $2`
	err = database.ExecuteQuery(ctx, query, hashedPassword, userID)
	return err
}

func (s *UserService) AddUserSkill(ctx context.Context, userID, skill string) error {
	query := `UPDATE users SET skills = array_append(skills, $1) WHERE id = $2`
	err := database.ExecuteQuery(ctx, query, skill, userID)
	return err
}

func (s *UserService) RemoveUserSkill(ctx context.Context, userID, skill string) error {
	query := `UPDATE users SET skills = array_remove(skills, $1) WHERE id = $2`
	err := database.ExecuteQuery(ctx, query, skill, userID)
	return err
}

func (s *UserService) GetUserByUsername(ctx context.Context, username string) (*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, bio, profile_image_url, skills, education_level, years_experience, preferred_role, github_url, linkedin_url, portfolio_url, email_verified, last_active, time_zone, available_hours, certifications, languages, project_preferences, created_at, updated_at
		FROM users
		WHERE username = $1
	`
	user := &model.User{}
	err := database.QueryRow(ctx, query, username).Scan(
		&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Bio, &user.ProfileImageURL,
		&user.Skills, &user.EducationLevel, &user.YearsExperience, &user.PreferredRole, &user.GithubURL,
		&user.LinkedInURL, &user.PortfolioURL, &user.EmailVerified, &user.LastActive, &user.TimeZone,
		&user.AvailableHours, &user.Certifications, &user.Languages, &user.ProjectPreferences,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return user, nil
}
