from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import init_db
from .routers import payments

app = FastAPI(
    title="Payment Service",
    description="University Payment System with Niger-specific providers (MyNita, Bank Cards)",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(payments.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()


@app.get("/")
async def root():
    return {
        "message": "Payment Service API",
        "version": "1.0.0",
        "status": "running",
        "supported_providers": ["mynita", "bank_card", "mobile_money"],
        "currency": "XOF",
        "endpoints": {
            "initiate": "/api/payments/initiate",
            "status": "/api/payments/status/{transaction_id}",
            "history": "/api/payments/student/{student_id}",
            "providers": "/api/payments/providers"
        }
    }


@app.get("/health")
async def health():
    return {"status": "UP", "service": "payment-service"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8083"))
    uvicorn.run(app, host="0.0.0.0", port=port)
