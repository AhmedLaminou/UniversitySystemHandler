from fastapi import APIRouter, HTTPException
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from app.models import ChatRequest, ChatResponse
from app.core.config import settings
from app.tools.student_tools import get_my_grades, get_my_schedule, get_university_info

router = APIRouter()

# Initialize LLM
llm = ChatOpenAI(
    api_key=settings.OPEN_ROUTER_KEY,
    base_url="https://openrouter.ai/api/v1",
    model="openai/gpt-3.5-turbo",
    temperature=0.7,
    default_headers={
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "UniPortal University System"
    }
)

# Define Tools
tools = [get_my_grades, get_my_schedule, get_university_info]

# Create Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful University Assistant AI. You help students with their academic life. "
               "You have access to tools to fetch grades and schedules. "
               "If you don't know the answer, say so politely."),
    ("user", "{input}"),
    ("assistant", "{agent_scratchpad}"),
])

# Create Agent
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # In a real app, we would get the student_id from the authenticated user context
        # For this MVP, we assume it might be passed or we use a mock default
        student_id = request.user_id or "1" 
        
        # We append context to the input
        input_text = f"User (Student ID: {student_id}): {request.message}"
        
        result = await agent_executor.ainvoke({"input": input_text})
        
        return ChatResponse(
            response=result["output"],
            source="ai-agent"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
