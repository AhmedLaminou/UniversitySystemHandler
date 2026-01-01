from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Date
from sqlalchemy.sql import func
from .database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    course_id = Column(String(50), nullable=False, index=True)
    schedule_id = Column(String(50))
    
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)  # present, absent, late, excused
    
    # Timing
    check_in_time = Column(DateTime(timezone=True))
    check_out_time = Column(DateTime(timezone=True))
    
    # Verification method
    verification_method = Column(String(20))  # qr_code, manual, biometric
    verified_by = Column(String(100))  # Professor ID or system
    
    remarks = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AttendanceSummary(Base):
    """Pre-computed attendance summary per student-course."""
    __tablename__ = "attendance_summary"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    course_id = Column(String(50), nullable=False, index=True)
    semester = Column(String(20), nullable=False)
    
    total_classes = Column(Integer, default=0)
    classes_attended = Column(Integer, default=0)
    classes_absent = Column(Integer, default=0)
    classes_late = Column(Integer, default=0)
    classes_excused = Column(Integer, default=0)
    
    attendance_percentage = Column(Float, default=0.0)
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
