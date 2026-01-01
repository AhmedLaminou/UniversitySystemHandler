from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

from ..database import get_db, Base, engine
from ..attendance_models import Attendance, AttendanceSummary

# Create tables
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


# Schemas
class AttendanceCreate(BaseModel):
    student_id: str
    course_id: str
    schedule_id: Optional[str] = None
    date: date
    status: str  # present, absent, late, excused
    verification_method: Optional[str] = None
    verified_by: Optional[str] = None
    remarks: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: int
    student_id: str
    course_id: str
    date: date
    status: str
    check_in_time: Optional[datetime] = None
    verification_method: Optional[str] = None
    
    class Config:
        from_attributes = True


class AttendanceSummaryResponse(BaseModel):
    student_id: str
    course_id: str
    total_classes: int
    classes_attended: int
    classes_absent: int
    attendance_percentage: float


# Endpoints
@router.post("/", response_model=AttendanceResponse, status_code=201)
async def record_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    """Record attendance for a student."""
    attendance = Attendance(
        student_id=data.student_id,
        course_id=data.course_id,
        schedule_id=data.schedule_id,
        date=data.date,
        status=data.status,
        check_in_time=datetime.utcnow() if data.status == "present" else None,
        verification_method=data.verification_method,
        verified_by=data.verified_by,
        remarks=data.remarks
    )
    
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    # Update summary
    await _update_summary(db, data.student_id, data.course_id)
    
    return attendance


@router.get("/student/{student_id}/course/{course_id}", response_model=List[AttendanceResponse])
async def get_student_course_attendance(
    student_id: str,
    course_id: str,
    db: Session = Depends(get_db)
):
    """Get attendance records for a student in a specific course."""
    records = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.course_id == course_id
    ).order_by(Attendance.date.desc()).all()
    
    return records


@router.get("/student/{student_id}/summary", response_model=List[AttendanceSummaryResponse])
async def get_student_attendance_summary(
    student_id: str,
    db: Session = Depends(get_db)
):
    """Get attendance summary for all courses a student is enrolled in."""
    summaries = db.query(AttendanceSummary).filter(
        AttendanceSummary.student_id == student_id
    ).all()
    
    return summaries


@router.get("/course/{course_id}/date/{date_str}")
async def get_course_attendance_by_date(
    course_id: str,
    date_str: str,
    db: Session = Depends(get_db)
):
    """Get attendance for a course on a specific date."""
    target_date = date.fromisoformat(date_str)
    
    records = db.query(Attendance).filter(
        Attendance.course_id == course_id,
        Attendance.date == target_date
    ).all()
    
    stats = {
        "present": sum(1 for r in records if r.status == "present"),
        "absent": sum(1 for r in records if r.status == "absent"),
        "late": sum(1 for r in records if r.status == "late"),
        "excused": sum(1 for r in records if r.status == "excused")
    }
    
    return {
        "course_id": course_id,
        "date": date_str,
        "total_students": len(records),
        "stats": stats,
        "records": records
    }


@router.put("/{attendance_id}")
async def update_attendance(
    attendance_id: int,
    status: str,
    remarks: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update an attendance record."""
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    record.status = status
    if remarks:
        record.remarks = remarks
    
    db.commit()
    
    # Update summary
    await _update_summary(db, record.student_id, record.course_id)
    
    return {"message": "Attendance updated", "id": attendance_id}


async def _update_summary(db: Session, student_id: str, course_id: str):
    """Update or create attendance summary for a student-course pair."""
    records = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.course_id == course_id
    ).all()
    
    total = len(records)
    attended = sum(1 for r in records if r.status in ["present", "late"])
    absent = sum(1 for r in records if r.status == "absent")
    late = sum(1 for r in records if r.status == "late")
    excused = sum(1 for r in records if r.status == "excused")
    
    percentage = (attended / total * 100) if total > 0 else 0.0
    
    summary = db.query(AttendanceSummary).filter(
        AttendanceSummary.student_id == student_id,
        AttendanceSummary.course_id == course_id
    ).first()
    
    if summary:
        summary.total_classes = total
        summary.classes_attended = attended
        summary.classes_absent = absent
        summary.classes_late = late
        summary.classes_excused = excused
        summary.attendance_percentage = percentage
    else:
        summary = AttendanceSummary(
            student_id=student_id,
            course_id=course_id,
            semester="2024-2025",
            total_classes=total,
            classes_attended=attended,
            classes_absent=absent,
            classes_late=late,
            classes_excused=excused,
            attendance_percentage=percentage
        )
        db.add(summary)
    
    db.commit()
