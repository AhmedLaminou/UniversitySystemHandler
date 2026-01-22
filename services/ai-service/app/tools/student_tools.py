import httpx
from langchain.tools import tool
from typing import List, Dict, Any
from app.core.config import settings

@tool
async def get_my_grades(student_id: str) -> str:
    """Fetch grades for a specific student given their ID.
    Use this when a student asks about their grades, GPA, or exam results."""
    async with httpx.AsyncClient() as client:
        try:
            # Corrected to match the actual grade-service endpoint with /api prefix
            response = await client.get(f"{settings.GRADE_SERVICE_URL}/api/grades/student/{student_id}")
            if response.status_code == 200:
                data = response.json()
                return f"Données des notes pour l'étudiant {student_id}: {data}"
            return "Could not fetch grades at this time."
        except Exception as e:
            return f"Error connecting to grade service: {str(e)}"

@tool
async def get_my_schedule(student_id: str) -> str:
    """Fetch the class schedule for a student.
    Use this when a student asks 'When is my next class?' or 'Show my timetable'."""
    # Mocking for now as course-service is SOAP and complex to call directly from here quickly without a SOAP client
    # In a real impl, we would use a SOAP client or the gateway
    return f"Schedule for student {student_id}: Monday 8am: Java, Tuesday 10am: SOA, Wednesday 2pm: Database."

@tool
async def get_university_info(query: str) -> str:
    """Get general information about the university, admissions, and policies.
    Use this for general questions like 'How do I register?' or 'What are the fees?'."""
    # Simple RAG mock or hardcoded info
    info = {
        "fees": "Tuition fees are 500,000 FCFA per year.",
        "registration": "Registration is open from September to October at the administration building.",
        "contact": "Contact us at contact@universite.ne"
    }
    return info.get(query, "I can answer questions about fees, registration, and contact info.")
