from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum


class GradeLetter(str, enum.Enum):
    A_PLUS = "A+"
    A = "A"
    A_MINUS = "A-"
    B_PLUS = "B+"
    B = "B"
    B_MINUS = "B-"
    C_PLUS = "C+"
    C = "C"
    C_MINUS = "C-"
    D = "D"
    F = "F"


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    course_id = Column(String(50), nullable=False, index=True)
    course_name = Column(String(200), nullable=False)
    score = Column(Float, nullable=False)
    grade_letter = Column(String(2), nullable=False)
    credits = Column(Integer, default=3)
    semester = Column(String(20), nullable=False)  # e.g., "2025-S1", "2025-S2"
    academic_year = Column(String(10), nullable=False)  # e.g., "2024-2025"
    professor_name = Column(String(100))
    remarks = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @staticmethod
    def calculate_grade_letter(score: float) -> str:
        """Calculate grade letter from numeric score."""
        if score >= 95:
            return "A+"
        elif score >= 90:
            return "A"
        elif score >= 85:
            return "A-"
        elif score >= 80:
            return "B+"
        elif score >= 75:
            return "B"
        elif score >= 70:
            return "B-"
        elif score >= 65:
            return "C+"
        elif score >= 60:
            return "C"
        elif score >= 55:
            return "C-"
        elif score >= 50:
            return "D"
        else:
            return "F"

    @staticmethod
    def get_grade_points(grade_letter: str) -> float:
        """Get GPA points for a grade letter."""
        points = {
            "A+": 4.0, "A": 4.0, "A-": 3.7,
            "B+": 3.3, "B": 3.0, "B-": 2.7,
            "C+": 2.3, "C": 2.0, "C-": 1.7,
            "D": 1.0, "F": 0.0
        }
        return points.get(grade_letter, 0.0)


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), nullable=False, unique=True, index=True)
    student_name = Column(String(200), nullable=False)
    cumulative_gpa = Column(Float, default=0.0)
    total_credits = Column(Integer, default=0)
    total_courses = Column(Integer, default=0)
    status = Column(String(20), default="ACTIVE")  # ACTIVE, GRADUATED, SUSPENDED
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
