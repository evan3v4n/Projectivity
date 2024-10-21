package services

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/evan3v4n/Projectivity/backend/go/graph/model"
)

type TaskService struct {
	DB *sql.DB
}

func NewTaskService(db *sql.DB) *TaskService {
	return &TaskService{
		DB: db,
	}
}

func (s *TaskService) CreateTask(ctx context.Context, input model.CreateTaskInput) (*model.Task, error) {
	query := `
		INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
		RETURNING id, title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at`

	task := &model.Task{
		Title:       input.Title,
		Description: input.Description,
		Status:      model.TaskStatusTodo,
		Priority:    input.Priority,
		DueDate:     input.DueDate,
		Project:     &model.Project{ID: input.ProjectID},
		CreatedAt:   time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:   time.Now().UTC().Format(time.RFC3339),
	}

	if input.Status != nil {
		task.Status = *input.Status
	}

	if input.AssigneeID != nil {
		task.Assignee = &model.User{ID: *input.AssigneeID}
	}

	err := s.DB.QueryRowContext(ctx, query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.DueDate,
		task.Project.ID,
		input.AssigneeID,
		task.CreatedAt,
	).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.Priority,
		&task.DueDate,
		&task.Project.ID,
		&task.Assignee.ID,
		&task.CreatedAt,
		&task.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create task: %v", err)
	}

	return task, nil
}

func (s *TaskService) GetTaskByID(ctx context.Context, taskID string) (*model.Task, error) {
	query := `
		SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, 
		       t.project_id, t.assignee_id, t.created_at, t.updated_at,
		       p.title as project_title, u.username as assignee_username
		FROM tasks t
		LEFT JOIN projects p ON t.project_id = p.id
		LEFT JOIN users u ON t.assignee_id = u.id
		WHERE t.id = $1`

	var task model.Task
	var projectTitle, assigneeUsername sql.NullString

	err := s.DB.QueryRowContext(ctx, query, taskID).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.Priority,
		&task.DueDate,
		&task.Project.ID,
		&task.Assignee.ID,
		&task.CreatedAt,
		&task.UpdatedAt,
		&projectTitle,
		&assigneeUsername,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("task not found: %v", taskID)
		}
		return nil, fmt.Errorf("failed to get task: %v", err)
	}

	// Set Project and Assignee details if they exist
	if projectTitle.Valid {
		task.Project = &model.Project{
			ID:    task.Project.ID,
			Title: projectTitle.String,
		}
	}

	if assigneeUsername.Valid {
		task.Assignee = &model.User{
			ID:       task.Assignee.ID,
			Username: assigneeUsername.String,
		}
	}

	return &task, nil
}

func (s *TaskService) UpdateTask(ctx context.Context, taskID string, input model.UpdateTaskInput) (*model.Task, error) {
	// Start building the query
	query := "UPDATE tasks SET "
	var args []interface{}
	argIndex := 1

	// Helper function to add a field to the query
	addField := func(field string, value interface{}) {
		if argIndex > 1 {
			query += ", "
		}
		query += field + " = $" + strconv.Itoa(argIndex)
		args = append(args, value)
		argIndex++
	}

	// Add fields to update based on input
	if input.Title != nil {
		addField("title", *input.Title)
	}
	if input.Description != nil {
		addField("description", *input.Description)
	}
	if input.Status != nil {
		addField("status", *input.Status)
	}
	if input.Priority != nil {
		addField("priority", *input.Priority)
	}
	if input.DueDate != nil {
		addField("due_date", *input.DueDate)
	}
	if input.AssigneeID != nil {
		addField("assignee_id", *input.AssigneeID)
	}

	// Add updated_at field
	addField("updated_at", time.Now().UTC())

	// Finish the query
	query += " WHERE id = $" + strconv.Itoa(argIndex) + " RETURNING id, title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at"
	args = append(args, taskID)

	// Execute the query
	var task model.Task
	err := s.DB.QueryRowContext(ctx, query, args...).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.Priority,
		&task.DueDate,
		&task.Project.ID,
		&task.Assignee.ID,
		&task.CreatedAt,
		&task.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("task not found: %v", taskID)
		}
		return nil, fmt.Errorf("failed to update task: %v", err)
	}

	// Fetch project and assignee details
	if task.Project.ID != "" {
		err = s.DB.QueryRowContext(ctx, "SELECT title FROM projects WHERE id = $1", task.Project.ID).Scan(&task.Project.Title)
		if err != nil && err != sql.ErrNoRows {
			return nil, fmt.Errorf("failed to fetch project details: %v", err)
		}
	}

	if task.Assignee.ID != "" {
		err = s.DB.QueryRowContext(ctx, "SELECT username FROM users WHERE id = $1", task.Assignee.ID).Scan(&task.Assignee.Username)
		if err != nil && err != sql.ErrNoRows {
			return nil, fmt.Errorf("failed to fetch assignee details: %v", err)
		}
	}

	return &task, nil
}

func (s *TaskService) DeleteTask(ctx context.Context, taskID string) error {
	query := "DELETE FROM tasks WHERE id = $1"

	result, err := s.DB.ExecContext(ctx, query, taskID)
	if err != nil {
		return fmt.Errorf("failed to delete task: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task not found: %v", taskID)
	}

	return nil
}

func (s *TaskService) ListTasksByProject(ctx context.Context, projectID string) ([]*model.Task, error) {
	query := `
		SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, 
		       t.project_id, t.assignee_id, t.created_at, t.updated_at,
		       u.username as assignee_username
		FROM tasks t
		LEFT JOIN users u ON t.assignee_id = u.id
		WHERE t.project_id = $1
		ORDER BY t.created_at DESC`

	rows, err := s.DB.QueryContext(ctx, query, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to query tasks: %v", err)
	}
	defer rows.Close()

	var tasks []*model.Task
	for rows.Next() {
		var task model.Task
		var assigneeUsername sql.NullString

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.DueDate,
			&task.Project.ID,
			&task.Assignee.ID,
			&task.CreatedAt,
			&task.UpdatedAt,
			&assigneeUsername,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan task row: %v", err)
		}

		task.Project = &model.Project{ID: projectID}

		if assigneeUsername.Valid {
			task.Assignee = &model.User{
				ID:       task.Assignee.ID,
				Username: assigneeUsername.String,
			}
		}

		tasks = append(tasks, &task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating task rows: %v", err)
	}

	return tasks, nil
}

func (s *TaskService) AssignTask(ctx context.Context, taskID string, userID string) error {
	query := `
		UPDATE tasks
		SET assignee_id = $1, updated_at = $2
		WHERE id = $3`

	result, err := s.DB.ExecContext(ctx, query, userID, time.Now().UTC(), taskID)
	if err != nil {
		return fmt.Errorf("failed to assign task: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task not found: %v", taskID)
	}

	return nil
}

func (s *TaskService) UnassignTask(ctx context.Context, taskID string) error {
	// First, check if the task is currently assigned
	var currentAssigneeID sql.NullString
	checkQuery := `SELECT assignee_id FROM tasks WHERE id = $1`
	err := s.DB.QueryRowContext(ctx, checkQuery, taskID).Scan(&currentAssigneeID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("task not found: %v", taskID)
		}
		return fmt.Errorf("failed to check current assignee: %v", err)
	}

	if !currentAssigneeID.Valid {
		return nil // Task is already unassigned, no action needed
	}

	// If assigned, proceed with the unassignment
	updateQuery := `
		UPDATE tasks
		SET assignee_id = NULL, updated_at = $1
		WHERE id = $2`

	result, err := s.DB.ExecContext(ctx, updateQuery, time.Now().UTC(), taskID)
	if err != nil {
		return fmt.Errorf("failed to unassign task: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task not found: %v", taskID)
	}

	return nil
}

func (s *TaskService) UpdateTaskStatus(ctx context.Context, taskID string, status model.TaskStatus) error {
	query := `
		UPDATE tasks
		SET status = $1, updated_at = $2
		WHERE id = $3`

	result, err := s.DB.ExecContext(ctx, query, status, time.Now().UTC(), taskID)
	if err != nil {
		return fmt.Errorf("failed to update task status: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task not found: %v", taskID)
	}

	return nil
}

func (s *TaskService) GetTasksByUser(ctx context.Context, userID string) ([]*model.Task, error) {
	query := `
		SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, 
		       t.project_id, t.assignee_id, t.created_at, t.updated_at,
		       p.title as project_title
		FROM tasks t
		LEFT JOIN projects p ON t.project_id = p.id
		WHERE t.assignee_id = $1
		ORDER BY t.due_date ASC, t.priority DESC`

	rows, err := s.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query tasks: %v", err)
	}
	defer rows.Close()

	var tasks []*model.Task
	for rows.Next() {
		var task model.Task
		var projectTitle sql.NullString

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.DueDate,
			&task.Project.ID,
			&task.Assignee.ID,
			&task.CreatedAt,
			&task.UpdatedAt,
			&projectTitle,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan task row: %v", err)
		}

		task.Assignee = &model.User{ID: userID}

		if projectTitle.Valid {
			task.Project = &model.Project{
				ID:    task.Project.ID,
				Title: projectTitle.String,
			}
		}

		tasks = append(tasks, &task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating task rows: %v", err)
	}

	return tasks, nil
}

func (s *TaskService) SearchTasks(ctx context.Context, query string, limit, offset int) ([]*model.Task, error) {
	sqlQuery := `
		SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, 
		       t.project_id, t.assignee_id, t.created_at, t.updated_at,
		       p.title as project_title, u.username as assignee_username
		FROM tasks t
		LEFT JOIN projects p ON t.project_id = p.id
		LEFT JOIN users u ON t.assignee_id = u.id
		WHERE t.title ILIKE $1 OR t.description ILIKE $1
		ORDER BY t.created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := s.DB.QueryContext(ctx, sqlQuery, "%"+query+"%", limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to search tasks: %v", err)
	}
	defer rows.Close()

	var tasks []*model.Task
	for rows.Next() {
		var task model.Task
		var projectTitle, assigneeUsername sql.NullString

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.DueDate,
			&task.Project.ID,
			&task.Assignee.ID,
			&task.CreatedAt,
			&task.UpdatedAt,
			&projectTitle,
			&assigneeUsername,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan task row: %v", err)
		}

		if projectTitle.Valid {
			task.Project = &model.Project{
				ID:    task.Project.ID,
				Title: projectTitle.String,
			}
		}

		if assigneeUsername.Valid {
			task.Assignee = &model.User{
				ID:       task.Assignee.ID,
				Username: assigneeUsername.String,
			}
		}

		tasks = append(tasks, &task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating task rows: %v", err)
	}

	return tasks, nil
}
