import { gql } from '@apollo/client';

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      category
      status
      technologies
      owner {
        id
        username
      }
      openPositions
      timeCommitment
      popularity
      teamMembers {
        id
        user {
          id
          username
        }
        role
      }
      learningObjectives
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
    query GetProjects {
    projects(limit: 10, offset: 0) {
        id
        title
        description
        category
        status
        technologies
        openPositions
        timeCommitment
        popularity
        timeline
        learningObjectives
        createdAt
        updatedAt
    }
    }
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($query: String!) {
    searchProjects(query: $query) {
      id
      title
      description
      category
      status
      technologies
      openPositions
      timeCommitment
      popularity
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      firstName
      lastName
      bio
      profileImageUrl
      skills
      educationLevel
      yearsExperience
      preferredRole
      githubUrl
      linkedInUrl
      portfolioUrl
      emailVerified
      lastActive
      timeZone
      availableHours
      certifications
      languages
      projectPreferences
      joinedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      username
      firstName
      lastName
      profileImageUrl
      skills
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      assignee {
        id
        username
      }
      project {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID!, $status: TaskStatus, $limit: Int, $offset: Int) {
    tasks(projectId: $projectId, status: $status, limit: $limit, offset: $offset) {
      id
      title
      status
      priority
      dueDate
      assignee {
        id
        username
      }
    }
  }
`;

export const GET_USER_TASKS = gql`
  query GetUserTasks($userId: ID!, $status: TaskStatus, $limit: Int, $offset: Int) {
    userTasks(userId: $userId, status: $status, limit: $limit, offset: $offset) {
      id
      title
      status
      priority
      dueDate
      project {
        id
        title
      }
    }
  }
`;

export const GET_TEAM = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
      id
      name
      description
      project {
        id
        title
      }
      members {
        id
        user {
          id
          username
        }
        role
        joinedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TEAMS_BY_PROJECT = gql`
  query GetTeamsByProject($projectId: ID!) {
    teamsByProject(projectId: $projectId) {
      id
      name
      description
      members {
        id
        user {
          id
          username
        }
        role
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      category
      status
      technologies
      openPositions
      timeCommitment
      learningObjectives
      timeline
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      category
      status
      technologies
      openPositions
      timeCommitment
      learningObjectives
      timeline
      popularity
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const JOIN_TEAM = gql`
  mutation JoinTeam($teamId: ID!, $role: String!) {
    joinTeam(teamId: $teamId, role: $role) {
      id
      user {
        id
        username
      }
      team {
        id
        name
      }
      role
      joinedAt
    }
  }
`;

export const LEAVE_TEAM = gql`
  mutation LeaveTeam($teamId: ID!) {
    leaveTeam(teamId: $teamId)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
      firstName
      lastName
      bio
      profileImageUrl
      skills
      educationLevel
      yearsExperience
      preferredRole
      githubUrl
      linkedInUrl
      portfolioUrl
      timeZone
      availableHours
      certifications
      languages
      projectPreferences
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      firstName
      lastName
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($id: ID!, $oldPassword: String!, $newPassword: String!) {
    changePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
      id
      username
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      assignee {
        id
        username
      }
      project {
        id
        title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      assignee {
        id
        username
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $userId: ID!) {
    assignTask(taskId: $taskId, userId: $userId) {
      id
      assignee {
        id
        username
      }
    }
  }
`;

export const UNASSIGN_TASK = gql`
  mutation UnassignTask($taskId: ID!) {
    unassignTask(taskId: $taskId) {
      id
      assignee {
        id
        username
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: TaskStatus!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      description
      project {
        id
        title
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: ID!, $input: UpdateTeamInput!) {
    updateTeam(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id)
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

export const JOIN_PROJECT = gql`
  mutation JoinProject($projectId: ID!) {
    joinProject(projectId: $projectId) {
      id
      title
      teamMembers {
        id
        user {
          id
          username
        }
        role
      }
      openPositions
    }
  }
`;

export const REQUEST_TO_JOIN_PROJECT = gql`
  mutation RequestToJoinProject($projectId: ID!) {
    requestToJoinProject(projectId: $projectId) {
      id
      status
      user {
        id
        username
      }
      project {
        id
        title
      }
      createdAt
    }
  }
`;

export const GET_JOIN_REQUESTS = gql`
  query GetJoinRequests($projectId: ID!) {
    joinRequests(projectId: $projectId) {
      id
      status
      user {
        id
        username
      }
      createdAt
    }
  }
`;

export const APPROVE_JOIN_REQUEST = gql`
  mutation ApproveJoinRequest($requestId: ID!) {
    approveJoinRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

export const DENY_JOIN_REQUEST = gql`
  mutation DenyJoinRequest($requestId: ID!) {
    denyJoinRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

// Add these at the end of the file

