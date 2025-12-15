from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum

class ExamType(str, enum.Enum):
    DS = "DS"
    EXAM = "EXAM"
    TP = "TP"
    PROJET = "PROJET"
    CC = "CC"

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    course_id = Column(Integer, nullable=False, index=True)
    exam_type = Column(SQLEnum(ExamType), nullable=False)
    grade = Column(Float, nullable=False)
    coefficient = Column(Float, default=1.0)
    exam_date = Column(Date, nullable=False)
    comments = Column(Text, nullable=True)
    professor_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Grade {self.student_id} - {self.course_id}: {self.grade}>"
