from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Grade Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Grade Service API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "UP", "service": "grade-service"}

@app.get("/api/grades")
async def get_grades():
    return {"message": "Grades endpoint - Not implemented yet"}

@app.get("/api/grades/student/{student_id}")
async def get_student_grades(student_id: int):
    return {"message": f"Grades for student {student_id} - Not implemented yet", "student_id": student_id}

@app.get("/api/grades/student/{student_id}/average")
async def get_student_average(student_id: int):
    return {"message": f"Average for student {student_id} - Not implemented yet", "student_id": student_id, "average": 0.0}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

