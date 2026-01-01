from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import Grade, Transcript
from ..schemas import (
    GradeCreate, GradeUpdate, GradeResponse,
    GPAResponse, TranscriptResponse, TranscriptGrade, StudentGradesSummary
)

router = APIRouter(prefix="/api/grades", tags=["grades"])


# ================== CRUD Operations ==================

@router.post("/", response_model=GradeResponse, status_code=201)
async def create_grade(grade_data: GradeCreate, db: Session = Depends(get_db)):
    """Create a new grade entry."""
    grade_letter = Grade.calculate_grade_letter(grade_data.score)
    
    db_grade = Grade(
        student_id=grade_data.student_id,
        course_id=grade_data.course_id,
        course_name=grade_data.course_name,
        score=grade_data.score,
        grade_letter=grade_letter,
        credits=grade_data.credits,
        semester=grade_data.semester,
        academic_year=grade_data.academic_year,
        professor_name=grade_data.professor_name,
        remarks=grade_data.remarks
    )
    
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    
    # Update transcript
    await _update_transcript(db, grade_data.student_id)
    
    return db_grade


@router.get("/", response_model=List[GradeResponse])
async def get_all_grades(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    semester: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all grades with optional filtering."""
    query = db.query(Grade)
    
    if semester:
        query = query.filter(Grade.semester == semester)
    if academic_year:
        query = query.filter(Grade.academic_year == academic_year)
    
    return query.offset(skip).limit(limit).all()


@router.get("/{grade_id}", response_model=GradeResponse)
async def get_grade(grade_id: int, db: Session = Depends(get_db)):
    """Get a specific grade by ID."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade


@router.put("/{grade_id}", response_model=GradeResponse)
async def update_grade(
    grade_id: int,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db)
):
    """Update a grade entry."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    if grade_data.score is not None:
        grade.score = grade_data.score
        grade.grade_letter = Grade.calculate_grade_letter(grade_data.score)
    
    if grade_data.remarks is not None:
        grade.remarks = grade_data.remarks
    
    db.commit()
    db.refresh(grade)
    
    # Update transcript
    await _update_transcript(db, grade.student_id)
    
    return grade


@router.delete("/{grade_id}", status_code=204)
async def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    """Delete a grade entry."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    student_id = grade.student_id
    db.delete(grade)
    db.commit()
    
    # Update transcript
    await _update_transcript(db, student_id)
    
    return None


# ================== Student-specific Endpoints ==================

@router.get("/student/{student_id}", response_model=StudentGradesSummary)
async def get_student_grades(student_id: str, db: Session = Depends(get_db)):
    """Get all grades for a specific student with GPA summary."""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    
    if not grades:
        return StudentGradesSummary(
            student_id=student_id,
            grades=[],
            cumulative_gpa=0.0,
            total_credits=0
        )
    
    gpa_data = _calculate_gpa(grades)
    
    return StudentGradesSummary(
        student_id=student_id,
        grades=grades,
        cumulative_gpa=gpa_data["cumulative_gpa"],
        total_credits=gpa_data["total_credits"]
    )


@router.get("/student/{student_id}/gpa", response_model=GPAResponse)
async def get_student_gpa(
    student_id: str,
    semester: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Calculate GPA for a student, optionally for a specific semester."""
    query = db.query(Grade).filter(Grade.student_id == student_id)
    
    semester_gpa = None
    if semester:
        semester_grades = query.filter(Grade.semester == semester).all()
        if semester_grades:
            semester_data = _calculate_gpa(semester_grades)
            semester_gpa = semester_data["cumulative_gpa"]
    
    all_grades = query.all()
    if not all_grades:
        raise HTTPException(status_code=404, detail="No grades found for student")
    
    gpa_data = _calculate_gpa(all_grades)
    
    return GPAResponse(
        student_id=student_id,
        cumulative_gpa=gpa_data["cumulative_gpa"],
        semester_gpa=semester_gpa,
        total_credits=gpa_data["total_credits"],
        total_courses=gpa_data["total_courses"],
        grade_distribution=gpa_data["distribution"]
    )


@router.get("/student/{student_id}/transcript", response_model=TranscriptResponse)
async def get_student_transcript(student_id: str, db: Session = Depends(get_db)):
    """Generate official transcript for a student."""
    grades = db.query(Grade).filter(Grade.student_id == student_id).order_by(
        Grade.academic_year, Grade.semester
    ).all()
    
    if not grades:
        raise HTTPException(status_code=404, detail="No grades found for student")
    
    transcript = db.query(Transcript).filter(Transcript.student_id == student_id).first()
    
    gpa_data = _calculate_gpa(grades)
    
    transcript_grades = [
        TranscriptGrade(
            course_id=g.course_id,
            course_name=g.course_name,
            credits=g.credits,
            score=g.score,
            grade_letter=g.grade_letter,
            semester=g.semester
        )
        for g in grades
    ]
    
    return TranscriptResponse(
        student_id=student_id,
        student_name=transcript.student_name if transcript else "Unknown",
        cumulative_gpa=gpa_data["cumulative_gpa"],
        total_credits=gpa_data["total_credits"],
        total_courses=gpa_data["total_courses"],
        status=transcript.status if transcript else "ACTIVE",
        grades=transcript_grades,
        generated_at=datetime.utcnow()
    )


# ================== Helper Functions ==================

def _calculate_gpa(grades: List[Grade]) -> dict:
    """Calculate GPA from a list of grades."""
    if not grades:
        return {
            "cumulative_gpa": 0.0,
            "total_credits": 0,
            "total_courses": 0,
            "distribution": {}
        }
    
    total_points = 0.0
    total_credits = 0
    distribution = {}
    
    for grade in grades:
        points = Grade.get_grade_points(grade.grade_letter)
        total_points += points * grade.credits
        total_credits += grade.credits
        
        # Track distribution
        letter = grade.grade_letter
        distribution[letter] = distribution.get(letter, 0) + 1
    
    cumulative_gpa = total_points / total_credits if total_credits > 0 else 0.0
    
    return {
        "cumulative_gpa": round(cumulative_gpa, 2),
        "total_credits": total_credits,
        "total_courses": len(grades),
        "distribution": distribution
    }


async def _update_transcript(db: Session, student_id: str):
    """Update or create transcript for a student."""
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    gpa_data = _calculate_gpa(grades)
    
    transcript = db.query(Transcript).filter(Transcript.student_id == student_id).first()
    
    if transcript:
        transcript.cumulative_gpa = gpa_data["cumulative_gpa"]
        transcript.total_credits = gpa_data["total_credits"]
        transcript.total_courses = gpa_data["total_courses"]
    else:
        transcript = Transcript(
            student_id=student_id,
            student_name="Student",  # Would be fetched from student-service
            cumulative_gpa=gpa_data["cumulative_gpa"],
            total_credits=gpa_data["total_credits"],
            total_courses=gpa_data["total_courses"]
        )
        db.add(transcript)
    
    db.commit()
