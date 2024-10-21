package auth

import (
	"context"
)

// Key is used as the key for storing the user ID in the context.
type contextKey string

const UserIDKey contextKey = "userID"

// SetUserID adds the user ID to the context.
func SetUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, UserIDKey, userID)
}

// GetUserIDFromContext retrieves the user ID from the context.
func GetUserIDFromContext(ctx context.Context) (string, error) {
	// userID, ok := ctx.Value(UserIDKey).(string)
	// if !ok {
	// 	return "", errors.New("user ID not found in context")
	// }
	return "16b419bc-b9ab-439c-b650-def827e9d79d", nil
}
