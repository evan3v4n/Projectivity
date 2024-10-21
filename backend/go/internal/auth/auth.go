package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
	userID, ok := ctx.Value(UserIDKey).(string)
	if !ok {
		return "", errors.New("user ID not found in context")
	}
	return userID, nil
}

// TODO: Move this to a secure configuration, consider using environment variables
var jwtSecretKey []byte

func GenerateSecureKey(keySize int) ([]byte, error) {
	key := make([]byte, keySize)
	_, err := rand.Read(key)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func InitJWTSecretKey() error {
	if envKey := os.Getenv("JWT_SECRET_KEY"); envKey != "" {
		// fmt.Println(envKey)

		jwtSecretKey = []byte(envKey)
		return nil
	}
	key, err := GenerateSecureKey(32) // 256-bit key
	if err != nil {
		return err
	}
	jwtSecretKey = key

	// Optionally, you can print the generated key for manual setting in environment variables
	fmt.Printf("Generated JWT Secret Key: %s\n", base64.StdEncoding.EncodeToString(key))

	return nil
}

// CustomClaims extends StandardClaims to include additional fields
type CustomClaims struct {
	jwt.RegisteredClaims
	UserID string `json:"user_id"`
}

// GenerateToken creates a new JWT token for a user
func GenerateToken(userID string) (string, error) {
	claims := CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
		UserID: userID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

// AuthMiddleware checks for a JWT token in the Authorization header
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// No token provided, allow the request to proceed
			// Consider if you want to restrict access to authenticated users only
			next.ServeHTTP(w, r)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &CustomClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecretKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Add user ID to the context
		ctx := SetUserID(r.Context(), claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ValidateToken verifies the integrity and expiration of a token
func ValidateToken(tokenString string) (*CustomClaims, error) {
	if _, blacklisted := tokenBlacklist[tokenString]; blacklisted {
		return nil, errors.New("token has been invalidated")
	}

	claims := &CustomClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// RefreshToken generates a new token for a user
func RefreshToken(oldTokenString string) (string, error) {
	claims, err := ValidateToken(oldTokenString)
	if err != nil {
		return "", err
	}

	// Generate a new token with a renewed expiration time
	return GenerateToken(claims.UserID)
}

// GetUserIDFromToken extracts the user ID from a token string
func GetUserIDFromToken(tokenString string) (string, error) {
	claims, err := ValidateToken(tokenString)
	if err != nil {
		return "", err
	}
	return claims.UserID, nil
}

// AuthenticateUser is a middleware for GraphQL resolvers
func AuthenticateUser(ctx context.Context, next func(context.Context) (interface{}, error)) (interface{}, error) {
	token := GetTokenFromContext(ctx)
	if token == "" {
		return nil, errors.New("no token provided")
	}

	claims, err := ValidateToken(token)
	if err != nil {
		return nil, errors.New("invalid token")
	}

	// Add the user ID to the context
	ctx = SetUserID(ctx, claims.UserID)

	return next(ctx)
}

// GetTokenFromContext extracts the token from the context
// You'll need to implement this based on how you're passing the token in your GraphQL requests
func GetTokenFromContext(ctx context.Context) string {
	// Implementation depends on how you're passing the token
	// For example, if it's in the context as "token":
	token, _ := ctx.Value("token").(string)
	return token
}

var tokenBlacklist = make(map[string]time.Time)

func InvalidateToken(tokenString string) {
	_, err := ValidateToken(tokenString)
	if err == nil {
		tokenBlacklist[tokenString] = time.Now().Add(24 * time.Hour) // Keep in blacklist for 24 hours
	}
}
