package graph

import (
	"github.com/evan3v4n/Projectivity/backend/go/internal/services"
)

type Resolver struct {
	UserService    *services.UserService
	ProjectService *services.ProjectService
	TeamService    *services.TeamService
	TaskService    *services.TaskService
}
