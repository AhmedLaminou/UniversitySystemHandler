import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Service"
    MESSAGE: str = "University AI Assistant"
    PORT: int = int(os.getenv("PORT", 8086))
    OPEN_ROUTER_KEY: str = os.getenv("OPEN_ROUTER_KEY")
    
    # Service URLs
    STUDENT_SERVICE_URL: str = os.getenv("STUDENT_SERVICE_URL", "http://localhost:3000")
    COURSE_SERVICE_URL: str = os.getenv("COURSE_SERVICE_URL", "http://localhost:8082")
    GRADE_SERVICE_URL: str = os.getenv("GRADE_SERVICE_URL", "http://localhost:8000")

settings = Settings()
