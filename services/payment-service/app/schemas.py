from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PaymentProviderEnum(str, Enum):
    MYNITA = "mynita"
    BANK_CARD = "bank_card"
    MOBILE_MONEY = "mobile_money"


class PaymentStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class PaymentInitiateRequest(BaseModel):
    invoice_id: str = Field(..., description="Invoice ID to pay")
    student_id: str = Field(..., description="Student ID")
    amount: float = Field(..., gt=0, description="Amount to pay in XOF")
    provider: PaymentProviderEnum = Field(..., description="Payment provider")
    description: Optional[str] = None
    
    # Provider-specific fields
    phone_number: Optional[str] = Field(None, description="Phone number for mobile payments")
    card_number: Optional[str] = Field(None, description="Card number (will be masked)")
    card_expiry: Optional[str] = Field(None, description="Card expiry MM/YY")
    card_cvv: Optional[str] = Field(None, description="Card CVV")


class PaymentInitiateResponse(BaseModel):
    transaction_id: str
    status: str
    message: str
    redirect_url: Optional[str] = None
    provider_reference: Optional[str] = None


class PaymentStatusResponse(BaseModel):
    transaction_id: str
    invoice_id: str
    student_id: str
    amount: float
    currency: str
    provider: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentWebhookRequest(BaseModel):
    provider: str
    event_type: str
    transaction_id: str
    status: str
    payload: Optional[dict] = None


class PaymentHistoryResponse(BaseModel):
    transactions: list[PaymentStatusResponse]
    total: int
    page: int
    limit: int
