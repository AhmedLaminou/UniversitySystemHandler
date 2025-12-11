from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class GradeBase(BaseModel):
    student_id: str = Field(..., description="Student ID from Student Service")
    subject: str = Field(..., description="Subject name")
    value: float = Field(..., ge=0, le=20, description="Grade value (0-20)")
    date: Optional[datetime] = Field(default_factory=datetime.now)


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    subject: Optional[str] = None
    value: Optional[float] = Field(None, ge=0, le=20)
    date: Optional[datetime] = None


class Grade(GradeBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class GradeResponse(BaseModel):
    id: str
    student_id: str
    subject: str
    value: float
    date: datetime

    class Config:
        from_attributes = True


class AverageResponse(BaseModel):
    student_id: str
    average: float
    total_grades: int
