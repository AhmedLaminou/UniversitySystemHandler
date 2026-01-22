from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = {}

class ChatResponse(BaseModel):
    response: str
    source: Optional[str] = "ai-agent"
    context_used: Optional[List[str]] = []

class CourseRagRequest(BaseModel):
    course_id: str
    query: str

class QuizRequest(BaseModel):
    course_id: str
    topic: Optional[str] = None
    num_questions: int = 5
