from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional
from app.models.grade import ExamType

class GradeBase(BaseModel):
    student_id: str = Field(..., description="ID de l'étudiant")
    course_id: int = Field(..., description="ID du cours")
    exam_type: ExamType
    grade: float = Field(..., ge=0, le=20, description="Note sur 20")
    coefficient: float = Field(1.0, ge=0.1, le=5.0)
    exam_date: date
    comments: Optional[str] = None
    professor_id: Optional[int] = None

    @validator('grade')
    def validate_grade(cls, v):
        if v < 0 or v > 20:
            raise ValueError('La note doit être entre 0 et 20')
        return round(v, 2)

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade: Optional[float] = Field(None, ge=0, le=20)
    coefficient: Optional[float] = Field(None, ge=0.1, le=5.0)
    comments: Optional[str] = None
    exam_date: Optional[date] = None

class GradeResponse(GradeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class AverageResponse(BaseModel):
    student_id: str
    average: float
    total_credits: int
    grades_count: int

class StatisticsResponse(BaseModel):
    course_id: int
    average: float
    min_grade: float
    max_grade: float
    students_count: int
    pass_rate: float
