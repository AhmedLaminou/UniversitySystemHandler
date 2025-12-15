from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import grade_router
from app.config import settings
import uvicorn

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Grade Service",
    description="Service de gestion des notes - Architecture SOA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(grade_router.router, prefix="/api/grades", tags=["Grades"])

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "grade-service"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
