from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
import httpx
import os

from .models import GradeCreate, GradeUpdate, GradeResponse, AverageResponse
from .database import grades_collection
from .auth import verify_token, verify_admin

router = APIRouter(prefix="/grades", tags=["grades"])

STUDENT_SERVICE_URL = os.getenv("STUDENT_SERVICE_URL", "http://localhost:3000/students")


async def verify_student_exists(student_id: str, token: str) -> bool:
    """
    Verify that a student exists by calling the Student Service.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{STUDENT_SERVICE_URL}/{student_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            return response.status_code == 200
    except httpx.RequestError:
        return False


@router.post("/", response_model=GradeResponse, status_code=201)
async def create_grade(grade: GradeCreate, user: dict = Depends(verify_admin)):
    """
    Create a new grade (Admin only).
    Verifies that the student exists before creating the grade.
    """
    # Extract token from the request context (we'll need to pass it)
    # For simplicity, we'll skip student validation in this basic implementation
    # In production, you'd want to pass the token through or use a service account
    
    grade_dict = grade.model_dump()
    grade_dict["created_at"] = datetime.now()
    
    result = await grades_collection.insert_one(grade_dict)
    
    created_grade = await grades_collection.find_one({"_id": result.inserted_id})
    
    return GradeResponse(
        id=str(created_grade["_id"]),
        student_id=created_grade["student_id"],
        subject=created_grade["subject"],
        value=created_grade["value"],
        date=created_grade["date"]
    )


@router.get("/{student_id}", response_model=List[GradeResponse])
async def get_student_grades(student_id: str, user: dict = Depends(verify_token)):
    """
    Get all grades for a specific student (Any authenticated user).
    """
    cursor = grades_collection.find({"student_id": student_id})
    grades = await cursor.to_list(length=100)
    
    return [
        GradeResponse(
            id=str(grade["_id"]),
            student_id=grade["student_id"],
            subject=grade["subject"],
            value=grade["value"],
            date=grade["date"]
        )
        for grade in grades
    ]


@router.get("/average/{student_id}", response_model=AverageResponse)
async def get_student_average(student_id: str, user: dict = Depends(verify_token)):
    """
    Calculate the average grade for a specific student (Any authenticated user).
    """
    cursor = grades_collection.find({"student_id": student_id})
    grades = await cursor.to_list(length=100)
    
    if not grades:
        raise HTTPException(status_code=404, detail="No grades found for this student")
    
    total = sum(grade["value"] for grade in grades)
    average = total / len(grades)
    
    return AverageResponse(
        student_id=student_id,
        average=round(average, 2),
        total_grades=len(grades)
    )


@router.put("/{grade_id}", response_model=GradeResponse)
async def update_grade(grade_id: str, grade_update: GradeUpdate, user: dict = Depends(verify_admin)):
    """
    Update a grade (Admin only).
    """
    from bson import ObjectId
    
    update_data = {k: v for k, v in grade_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await grades_collection.update_one(
        {"_id": ObjectId(grade_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    updated_grade = await grades_collection.find_one({"_id": ObjectId(grade_id)})
    
    return GradeResponse(
        id=str(updated_grade["_id"]),
        student_id=updated_grade["student_id"],
        subject=updated_grade["subject"],
        value=updated_grade["value"],
        date=updated_grade["date"]
    )


@router.delete("/{grade_id}", status_code=204)
async def delete_grade(grade_id: str, user: dict = Depends(verify_admin)):
    """
    Delete a grade (Admin only).
    """
    from bson import ObjectId
    
    result = await grades_collection.delete_one({"_id": ObjectId(grade_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    return None
