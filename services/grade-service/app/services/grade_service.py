from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.grade import Grade, ExamType
from app.schemas.grade_schema import GradeCreate, GradeUpdate
from typing import List, Optional

class GradeService:
    
    @staticmethod
    def create_grade(db: Session, grade: GradeCreate) -> Grade:
        db_grade = Grade(**grade.dict())
        db.add(db_grade)
        db.commit()
        db.refresh(db_grade)
        return db_grade
    
    @staticmethod
    def get_grade(db: Session, grade_id: int) -> Optional[Grade]:
        return db.query(Grade).filter(Grade.id == grade_id).first()
    
    @staticmethod
    def get_grades_by_student(db: Session, student_id: str, skip: int = 0, limit: int = 100) -> List[Grade]:
        return db.query(Grade).filter(
            Grade.student_id == student_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_grades_by_course(db: Session, course_id: int, skip: int = 0, limit: int = 100) -> List[Grade]:
        return db.query(Grade).filter(
            Grade.course_id == course_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_grade(db: Session, grade_id: int, grade_update: GradeUpdate) -> Optional[Grade]:
        db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not db_grade:
            return None
        
        update_data = grade_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_grade, key, value)
        
        db.commit()
        db.refresh(db_grade)
        return db_grade
    
    @staticmethod
    def delete_grade(db: Session, grade_id: int) -> bool:
        db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
        if not db_grade:
            return False
        db.delete(db_grade)
        db.commit()
        return True
    
    @staticmethod
    def calculate_student_average(db: Session, student_id: str, course_id: Optional[int] = None) -> dict:
        query = db.query(
            func.sum(Grade.grade * Grade.coefficient).label('weighted_sum'),
            func.sum(Grade.coefficient).label('total_coef'),
            func.count(Grade.id).label('count')
        ).filter(Grade.student_id == student_id)
        
        if course_id:
            query = query.filter(Grade.course_id == course_id)
        
        result = query.first()
        
        if not result or result.count == 0:
            return {
                "student_id": student_id,
                "average": 0.0,
                "total_credits": 0,
                "grades_count": 0
            }
        
        average = round(result.weighted_sum / result.total_coef, 2) if result.total_coef > 0 else 0
        
        return {
            "student_id": student_id,
            "average": average,
            "total_credits": int(result.total_coef),
            "grades_count": result.count
        }
    
    @staticmethod
    def get_course_statistics(db: Session, course_id: int) -> dict:
        grades = db.query(Grade.grade).filter(Grade.course_id == course_id).all()
        
        if not grades:
            return {
                "course_id": course_id,
                "average": 0.0,
                "min_grade": 0.0,
                "max_grade": 0.0,
                "students_count": 0,
                "pass_rate": 0.0
            }
        
        grade_values = [g.grade for g in grades]
        passed = len([g for g in grade_values if g >= 10])
        
        return {
            "course_id": course_id,
            "average": round(sum(grade_values) / len(grade_values), 2),
            "min_grade": min(grade_values),
            "max_grade": max(grade_values),
            "students_count": len(grade_values),
            "pass_rate": round((passed / len(grade_values)) * 100, 2)
        }
    
    @staticmethod
    def get_transcript(db: Session, student_id: str) -> List[dict]:
        grades = db.query(Grade).filter(Grade.student_id == student_id).all()
        
        # Grouper par cours
        courses = {}
        for grade in grades:
            if grade.course_id not in courses:
                courses[grade.course_id] = []
            courses[grade.course_id].append({
                "exam_type": grade.exam_type,
                "grade": grade.grade,
                "coefficient": grade.coefficient,
                "exam_date": grade.exam_date
            })
        
        transcript = []
        for course_id, course_grades in courses.items():
            weighted_sum = sum(g["grade"] * g["coefficient"] for g in course_grades)
            total_coef = sum(g["coefficient"] for g in course_grades)
            avg = round(weighted_sum / total_coef, 2) if total_coef > 0 else 0
            
            transcript.append({
                "course_id": course_id,
                "grades": course_grades,
                "average": avg,
                "status": "PASS" if avg >= 10 else "FAIL"
            })
        
        return transcript
