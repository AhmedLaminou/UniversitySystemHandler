# Student Service API

## Overview

The **Student Service** is a RESTful API built with **Node.js** and **Express** that manages student records. It is designed to work within a microservices architecture, specifically integrating with a Spring Boot **Auth Service** for security and user validation.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete (Soft Delete) student records.
- **Secure Endpoints**: All API routes are protected by JWT authentication.
- **Role-Based Access Control (RBAC)**: Critical operations (Create, Update, Delete) are restricted to users with the `ADMIN` role.
- **Microservice Integration**: Validates JWT tokens by communicating with an external Auth Service.
- **Database**: Uses MongoDB for persistent storage.

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas)
- **Auth Service**: A running instance of the Spring Boot Auth Service (default: `http://localhost:8080`).

## Installation

1.  **Clone the repository** (if applicable) or navigate to the service directory:

    ```bash
    cd StudentService
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Configuration

The application uses a `.env` file for configuration. A default file is provided, but you can customize it:

**File:** `.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/student_db
AUTH_SERVICE_URL=http://localhost:8080/api/auth/me
```

- `PORT`: The port the service runs on.
- `MONGO_URI`: Connection string for your MongoDB database.
- `AUTH_SERVICE_URL`: The endpoint of the Auth Service used to validate tokens and retrieve user details.

## Running the Application

### Development Mode

Runs the server with `nodemon` for auto-reloading on changes.

```bash
npm run dev
```

### Production Mode

Runs the server using standard Node.js.

```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Documentation

### Authentication

All endpoints require a valid **JWT Token** in the `Authorization` header.
**Header Format:** `Authorization: Bearer <your_jwt_token>`

### Endpoints

| Method     | Endpoint               | Description                        | Access Level                                  |
| :--------- | :--------------------- | :--------------------------------- | :-------------------------------------------- |
| **GET**    | `/students`            | Retrieve all active students       | **Authenticated User** (Student, Prof, Admin) |
| **GET**    | `/students/:studentId` | Retrieve a specific student by ID  | **Authenticated User** (Student, Prof, Admin) |
| **POST**   | `/students`            | Create a new student record        | **ADMIN Only**                                |
| **PUT**    | `/students/:studentId` | Update an existing student         | **ADMIN Only**                                |
| **DELETE** | `/students/:studentId` | Soft delete (deactivate) a student | **ADMIN Only**                                |

### Sample Request Body (POST/PUT)

```json
{
  "studentId": "S12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "enrollmentDate": "2023-09-01"
}
```

## Architecture & Integration

### Auth Service Integration

This service does not decode JWTs locally to verify signatures. Instead, it delegates validation to the **Auth Service** to ensure the token is valid and the user session is active.

**Workflow:**

1.  Incoming request to `StudentService` contains `Authorization: Bearer <token>`.
2.  `StudentService` middleware extracts the token.
3.  It sends a `GET` request to `AUTH_SERVICE_URL` (e.g., `http://localhost:8080/api/auth/me`) with the same token.
4.  **If Auth Service returns 200 OK**: The user data (including `role`) is returned and attached to the request (`req.user`).
5.  **If Auth Service returns 401/403**: The request is denied.

### Project Structure

```
StudentService/
├── controllers/      # Business logic for API endpoints
│   └── StudentController.js
├── middleware/       # Custom middleware (Auth logic)
│   └── authorize.js
├── models/           # Mongoose schemas
│   └── Student.js
├── routes/           # API route definitions
│   └── StudentRoutes.js
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
├── server.js         # Application entry point
└── README.md         # Documentation
```
