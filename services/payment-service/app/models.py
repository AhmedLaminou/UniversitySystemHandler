from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from .database import Base
import enum


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class PaymentProvider(str, enum.Enum):
    MYNITA = "mynita"
    BANK_CARD = "bank_card"
    MOBILE_MONEY = "mobile_money"


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(100), unique=True, nullable=False, index=True)
    invoice_id = Column(String(50), nullable=False, index=True)
    student_id = Column(String(50), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="XOF")  # West African CFA franc
    provider = Column(String(20), nullable=False)  # mynita, bank_card, mobile_money
    provider_transaction_id = Column(String(100))
    status = Column(String(20), default="pending")
    description = Column(String(500))
    
    # Provider-specific fields
    phone_number = Column(String(20))  # For mobile payments
    card_last_four = Column(String(4))  # For card payments
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))

    def __repr__(self):
        return f"<PaymentTransaction {self.transaction_id}>"


class PaymentWebhookLog(Base):
    __tablename__ = "payment_webhook_logs"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(20), nullable=False)
    event_type = Column(String(50))
    payload = Column(String(5000))
    processed = Column(String(10), default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
