from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class GradeBase(BaseModel):
    student_id: str = Field(..., description="Student ID")
    course_id: str = Field(..., description="Course ID")
    course_name: str = Field(..., description="Course name")
    score: float = Field(..., ge=0, le=100, description="Numeric score (0-100)")
    credits: int = Field(default=3, ge=1, le=6, description="Course credits")
    semester: str = Field(..., description="Semester (e.g., 2025-S1)")
    academic_year: str = Field(..., description="Academic year (e.g., 2024-2025)")
    professor_name: Optional[str] = None
    remarks: Optional[str] = None


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    score: Optional[float] = Field(None, ge=0, le=100)
    remarks: Optional[str] = None


class GradeResponse(GradeBase):
    id: int
    grade_letter: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GPAResponse(BaseModel):
    student_id: str
    cumulative_gpa: float
    semester_gpa: Optional[float] = None
    total_credits: int
    total_courses: int
    grade_distribution: dict


class TranscriptGrade(BaseModel):
    course_id: str
    course_name: str
    credits: int
    score: float
    grade_letter: str
    semester: str


class TranscriptResponse(BaseModel):
    student_id: str
    student_name: str
    cumulative_gpa: float
    total_credits: int
    total_courses: int
    status: str
    grades: List[TranscriptGrade]
    generated_at: datetime


class StudentGradesSummary(BaseModel):
    student_id: str
    grades: List[GradeResponse]
    cumulative_gpa: float
    total_credits: int
