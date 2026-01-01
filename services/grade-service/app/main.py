from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import init_db
from .routers import grades
from .routers import attendance

app = FastAPI(
    title="Grade Service",
    description="University Grade Management System with GPA Calculation",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(grades.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()


@app.get("/")
async def root():
    return {
        "message": "Grade Service API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "grades": "/api/grades",
            "student_grades": "/api/grades/student/{student_id}",
            "gpa": "/api/grades/student/{student_id}/gpa",
            "transcript": "/api/grades/student/{student_id}/transcript"
        }
    }


@app.get("/health")
async def health():
    return {"status": "UP", "service": "grade-service"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
