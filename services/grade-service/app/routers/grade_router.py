from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.grade_schema import (
    GradeCreate, GradeUpdate, GradeResponse, 
    AverageResponse, StatisticsResponse
)
from app.services.grade_service import GradeService
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
def create_grade(
    grade: GradeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Créer une nouvelle note"""
    return GradeService.create_grade(db, grade)

@router.get("/{grade_id}", response_model=GradeResponse)
def get_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Récupérer une note par ID"""
    grade = GradeService.get_grade(db, grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Note non trouvée")
    return grade

@router.get("/student/{student_id}", response_model=List[GradeResponse])
def get_grades_by_student(
    student_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Récupérer les notes d'un étudiant"""
    return GradeService.get_grades_by_student(db, student_id, skip, limit)

@router.get("/course/{course_id}", response_model=List[GradeResponse])
def get_grades_by_course(
    course_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Récupérer les notes d'un cours"""
    return GradeService.get_grades_by_course(db, course_id, skip, limit)

@router.put("/{grade_id}", response_model=GradeResponse)
def update_grade(
    grade_id: int,
    grade_update: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Mettre à jour une note"""
    grade = GradeService.update_grade(db, grade_id, grade_update)
    if not grade:
        raise HTTPException(status_code=404, detail="Note non trouvée")
    return grade

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Supprimer une note"""
    success = GradeService.delete_grade(db, grade_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note non trouvée")
    return None

@router.get("/student/{student_id}/average", response_model=AverageResponse)
def get_student_average(
    student_id: str,
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculer la moyenne d'un étudiant"""
    return GradeService.calculate_student_average(db, student_id, course_id)

@router.get("/course/{course_id}/stats", response_model=StatisticsResponse)
def get_course_statistics(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Obtenir les statistiques d'un cours"""
    return GradeService.get_course_statistics(db, course_id)

@router.get("/student/{student_id}/transcript")
def get_student_transcript(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Obtenir le relevé de notes d'un étudiant"""
    return GradeService.get_transcript(db, student_id)
