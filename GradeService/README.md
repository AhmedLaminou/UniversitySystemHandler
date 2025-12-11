# Grade Service API

## Overview

The **Grade Service** is a RESTful API built with **Python (FastAPI)** that manages student grades and calculates averages. It integrates with the **Auth Service** for security and the **Student Service** for student validation.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete grade records
- **Average Calculation**: Calculate average grades per student
- **Secure Endpoints**: All routes protected by JWT authentication
- **Role-Based Access Control**: Admin-only operations for creating/updating/deleting grades
- **Microservice Integration**: Validates tokens via Auth Service
- **Database**: MongoDB for persistent storage

## Prerequisites

- **Python** 3.8+
- **MongoDB** (Local or Atlas)
- **Auth Service**: Running on `http://localhost:8080`
- **Student Service**: Running on `http://localhost:3000`

## Installation

1. **Navigate to the service directory**:

   ```bash
   cd GradeService
   ```

2. **Create a virtual environment** (recommended):

   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

The `.env` file contains:

```env
PORT=8002
MONGO_URI=mongodb://localhost:27017/grade_db
AUTH_SERVICE_URL=http://localhost:8080/api/auth/me
STUDENT_SERVICE_URL=http://localhost:3000/students
```

## Running the Application

### Development Mode

```bash
uvicorn app.main:app --reload --port 8002
```

Or using Python directly:

```bash
python -m app.main
```

The server will start on `http://localhost:8002`.

## API Documentation

### Interactive Docs

- **Swagger UI**: `http://localhost:8002/docs`
- **ReDoc**: `http://localhost:8002/redoc`

### Authentication

All endpoints require a valid **JWT Token** in the `Authorization` header.
**Header Format:** `Authorization: Bearer <your_jwt_token>`

### Endpoints

| Method     | Endpoint                       | Description                  | Access Level           |
| :--------- | :----------------------------- | :--------------------------- | :--------------------- |
| **POST**   | `/grades/`                     | Create a new grade           | **ADMIN Only**         |
| **GET**    | `/grades/{student_id}`         | Get all grades for a student | **Authenticated User** |
| **GET**    | `/grades/average/{student_id}` | Calculate average grade      | **Authenticated User** |
| **PUT**    | `/grades/{grade_id}`           | Update a grade               | **ADMIN Only**         |
| **DELETE** | `/grades/{grade_id}`           | Delete a grade               | **ADMIN Only**         |

### Sample Request Body (POST)

```json
{
  "student_id": "S1001",
  "subject": "Mathematics",
  "value": 18.5,
  "date": "2024-01-15T10:00:00"
}
```

### Sample Response (Average)

```json
{
  "student_id": "S1001",
  "average": 16.75,
  "total_grades": 4
}
```

## Architecture & Integration

### Auth Service Integration

The service validates JWT tokens by calling the Auth Service's `/api/auth/me` endpoint. The workflow:

1. Extract token from `Authorization` header
2. Send `GET` request to Auth Service with token
3. If valid (200 OK), attach user info to request
4. If invalid (401), reject the request

### Student Service Integration

When creating grades, the service can verify student existence by calling the Student Service (optional in current implementation).

### Project Structure

```
GradeService/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application entry point
│   ├── routes.py        # API endpoints
│   ├── models.py        # Pydantic models
│   ├── database.py      # MongoDB connection
│   └── auth.py          # Authentication middleware
├── .env                 # Environment variables
├── requirements.txt     # Python dependencies
└── README.md           # Documentation
```

## Testing

Use the provided `api_tests.http` file with VS Code REST Client extension, or test via Swagger UI at `http://localhost:8002/docs`.
