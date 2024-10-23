package graph

import (
	"github.com/evan3v4n/Projectivity/backend/go/internal/services"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserService        *services.UserService
	ProjectService     *services.ProjectService
	TeamService        *services.TeamService
	TaskService        *services.TaskService
	JoinRequestService *services.JoinRequestService
}

// // Query returns QueryResolver implementation.
// func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// // Mutation returns MutationResolver implementation.
// func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }
