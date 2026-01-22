from fastapi import APIRouter, HTTPException
from app.models import CourseRagRequest, QuizRequest, ChatResponse
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings

router = APIRouter()

llm = ChatOpenAI(
    api_key=settings.OPEN_ROUTER_KEY,
    base_url="https://openrouter.ai/api/v1",
    model="openai/gpt-3.5-turbo", 
    temperature=0.7
)

# Mock Data store for course content (In real life, this would be a Vector DB)
COURSE_CONTENT = {
    "1": """
    Course: SOA (Service Oriented Architecture)
    Description: This course covers the principles of SOA, Web Services (SOAP, REST), Microservices, and Cloud Computing.
    Key Topics: XML, JSON, WSDL, UDDI, Docker, Kubernetes.
    Assessment: 40% Project, 60% Final Exam.
    """,
    "2": """
    Course: Java Programming
    Description: Introduction to Object Oriented Programming using Java.
    Key Topics: Classes, Objects, Inheritance, Polymorphism, Collections Framework, Streams API.
    Assessment: 50% Labs, 50% Exam.
    """
}

@router.post("/rag/chat", response_model=ChatResponse)
async def course_chat(request: CourseRagRequest):
    content = COURSE_CONTENT.get(request.course_id, "Course content not found.")
    
    prompt = ChatPromptTemplate.from_template(
        """
        You are an expert Teaching Assistant for the course. 
        Answer the student's question based ONLY on the following course context:
        
        {context}
        
        Student Question: {question}
        """
    )
    
    chain = prompt | llm
    result = await chain.ainvoke({"context": content, "question": request.query})
    
    return ChatResponse(response=result.content, source="course-assistant")

@router.post("/rag/quiz", response_model=ChatResponse)
async def generate_quiz(request: QuizRequest):
    content = COURSE_CONTENT.get(request.course_id, "Course content not found.")
    
    prompt = ChatPromptTemplate.from_template(
        """
        Generate a short quiz with {num} questions based on this course content:
        
        {context}
        
        Format the output as a numbered list of questions. Do not include answers.
        """
    )
    
    chain = prompt | llm
    result = await chain.ainvoke({"context": content, "num": request.num_questions})
    
    return ChatResponse(response=result.content, source="course-quiz-generator")
