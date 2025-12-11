from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8080/api/auth/me")

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify JWT token by calling the Auth Service.
    Returns user information if valid.
    """
    token = credentials.credentials
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                AUTH_SERVICE_URL,
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired token"
                )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Auth service unavailable: {str(e)}"
        )


async def verify_admin(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify that the user has ADMIN role.
    """
    user = await verify_token(credentials)
    
    if user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin role required"
        )
    
    return user
