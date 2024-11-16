# Projectivity Backend

A collaborative project management platform built with Go, GraphQL, and PostgreSQL.

## System Architecture

### High-Level Architecture
![System Architecture](./docs/images/system-architecture.png)
*System architecture showing the interaction between client, API layer, services, and database*

### Database Schema
![Database Schema](./docs/images/database-schema.png)
*Entity-relationship diagram showing the database structure and relationships*

## Features

- **Project Management**
  - Create and manage collaborative projects
  - Track project status and progress
  - Manage technology stacks
  - Set learning objectives

- **User Management**
  - JWT-based authentication
  - Profile management with skills tracking
  - Project ownership and collaboration

- **Team Collaboration**
  - Role-based team management
  - Join request system
  - Team member tracking

- **Task Management**
  - Task creation and assignment
  - Priority levels and status tracking
  - Due date management

## Tech Stack

- **Go** (v1.22.5)
- **GraphQL** (gqlgen v0.17.55)
- **PostgreSQL**
- **Chi Router**
- **JWT Authentication**
- **CORS enabled**

## Project Structure

```
backend/go/
├── cmd/
│   └── api/           # Application entry point
├── graph/
│   ├── model/         # GraphQL models
│   ├── schema.graphqls # GraphQL schema
│   ├── generated.go   # Generated GraphQL code
│   ├── resolver.go    # GraphQL resolvers
│   └── schema.resolvers.go
├── internal/
│   ├── auth/          # Authentication logic
│   ├── database/      # Database connections and models
│   └── services/      # Business logic
└── pkg/
    └── utils/         # Shared utilities
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/projectivity-backend.git
   cd projectivity-backend
   ```

2. **Set up environment variables**
   ```bash
   export PORT=8080
   export DATABASE_URL="postgresql://user:password@localhost:5432/projectivity?sslmode=disable"
   export JWT_SECRET="your-secret-key"
   ```

3. **Configure the database**
   ```go
   dbConfig := database.Config{
       Host:     "localhost",
       Port:     5432,
       User:     "projectivity_user",
       Password: "your-password",
       DBName:   "projectivity",
       SSLMode:  "disable",
   }
   ```

4. **Install dependencies**
   ```bash
   go mod download
   ```

5. **Run the application**
   ```bash
   go run cmd/api/main.go
   ```

## API Examples

### Create Project
```graphql
mutation {
  createProject(input: {
    title: "Project Name"
    description: "Project Description"
    category: "Web Development"
    technologies: ["React", "Go", "PostgreSQL"]
    openPositions: 3
    timeCommitment: "10 hours/week"
    learningObjectives: ["GraphQL", "Go"]
  }) {
    id
    title
    status
  }
}
```

### Query Projects
```graphql
query {
  projects(
    category: "Web Development"
    status: IN_PROGRESS
    limit: 10
    offset: 0
  ) {
    id
    title
    description
    technologies
    owner {
      username
    }
  }
}
```

## Authentication

JWT-based authentication is implemented. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Dependencies

```go
require (
    github.com/99designs/gqlgen v0.17.55
    github.com/go-chi/chi v1.5.5
    github.com/golang-jwt/jwt/v5 v5.2.1
    github.com/google/uuid v1.6.0
    github.com/lib/pq v1.10.9
    github.com/rs/cors v1.11.1
    github.com/vektah/gqlparser/v2 v2.5.18
    golang.org/x/crypto v0.28.0
)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
