from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid
import json

from ..database import get_db
from ..models import PaymentTransaction, PaymentWebhookLog
from ..schemas import (
    PaymentInitiateRequest, PaymentInitiateResponse,
    PaymentStatusResponse, PaymentWebhookRequest, PaymentHistoryResponse
)
from ..providers.mynita import MyNitaProvider
from ..providers.bankcard import BankCardProvider

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Initialize providers
mynita_provider = MyNitaProvider()
bankcard_provider = BankCardProvider()


def get_provider(provider_name: str):
    """Get the appropriate payment provider."""
    providers = {
        "mynita": mynita_provider,
        "bank_card": bankcard_provider,
        "mobile_money": mynita_provider,  # Can add separate provider later
    }
    if provider_name not in providers:
        raise HTTPException(status_code=400, detail=f"Provider non supporté: {provider_name}")
    return providers[provider_name]


# ================== Payment Endpoints ==================

@router.post("/initiate", response_model=PaymentInitiateResponse)
async def initiate_payment(
    request: PaymentInitiateRequest,
    db: Session = Depends(get_db)
):
    """
    Initiate a new payment.
    
    Supports:
    - MyNita (mobile wallet)
    - Bank Card (credit/debit)
    - Mobile Money
    """
    # Generate unique transaction ID
    transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
    
    # Get appropriate provider
    provider = get_provider(request.provider.value)
    
    # Create transaction record
    transaction = PaymentTransaction(
        transaction_id=transaction_id,
        invoice_id=request.invoice_id,
        student_id=request.student_id,
        amount=request.amount,
        currency="XOF",
        provider=request.provider.value,
        status="pending",
        description=request.description,
        phone_number=request.phone_number
    )
    db.add(transaction)
    db.commit()
    
    # Initiate with provider
    try:
        result = await provider.initiate_payment(
            amount=request.amount,
            currency="XOF",
            transaction_id=transaction_id,
            description=request.description or f"Paiement facture {request.invoice_id}",
            phone_number=request.phone_number,
            card_number=request.card_number,
            card_expiry=request.card_expiry,
            card_cvv=request.card_cvv
        )
        
        # Update transaction with provider reference
        transaction.provider_transaction_id = result.provider_reference
        transaction.status = "processing"
        
        # Store card last 4 digits (never store full number!)
        if request.card_number and len(request.card_number) >= 4:
            transaction.card_last_four = request.card_number[-4:]
        
        db.commit()
        
        return PaymentInitiateResponse(
            transaction_id=transaction_id,
            status="processing",
            message=result.message,
            redirect_url=result.redirect_url,
            provider_reference=result.provider_reference
        )
        
    except Exception as e:
        transaction.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{transaction_id}", response_model=PaymentStatusResponse)
async def get_payment_status(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """Get the status of a payment transaction."""
    transaction = db.query(PaymentTransaction).filter(
        PaymentTransaction.transaction_id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    
    return transaction


@router.get("/student/{student_id}", response_model=PaymentHistoryResponse)
async def get_student_payments(
    student_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get payment history for a student."""
    query = db.query(PaymentTransaction).filter(
        PaymentTransaction.student_id == student_id
    ).order_by(PaymentTransaction.created_at.desc())
    
    total = query.count()
    transactions = query.offset((page - 1) * limit).limit(limit).all()
    
    return PaymentHistoryResponse(
        transactions=transactions,
        total=total,
        page=page,
        limit=limit
    )


@router.get("/invoice/{invoice_id}", response_model=list[PaymentStatusResponse])
async def get_invoice_payments(
    invoice_id: str,
    db: Session = Depends(get_db)
):
    """Get all payment attempts for an invoice."""
    transactions = db.query(PaymentTransaction).filter(
        PaymentTransaction.invoice_id == invoice_id
    ).order_by(PaymentTransaction.created_at.desc()).all()
    
    return transactions


# ================== Webhook Endpoints ==================

@router.post("/webhook/mynita")
async def mynita_webhook(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Handle MyNita payment webhooks.
    
    MyNita will call this endpoint when a payment status changes.
    """
    # Log the webhook
    log = PaymentWebhookLog(
        provider="mynita",
        event_type=payload.get("event", "unknown"),
        payload=json.dumps(payload)
    )
    db.add(log)
    
    # Process the webhook
    transaction_ref = payload.get("reference") or payload.get("transaction_id")
    status = payload.get("status", "").lower()
    
    if transaction_ref:
        transaction = db.query(PaymentTransaction).filter(
            PaymentTransaction.transaction_id == transaction_ref
        ).first()
        
        if transaction:
            if status in ["success", "completed"]:
                transaction.status = "completed"
                transaction.completed_at = datetime.utcnow()
            elif status in ["failed", "cancelled"]:
                transaction.status = status
            
            log.processed = "true"
    
    db.commit()
    return {"status": "received"}


@router.post("/webhook/card")
async def card_webhook(
    payload: dict,
    db: Session = Depends(get_db)
):
    """Handle card payment webhooks."""
    log = PaymentWebhookLog(
        provider="bank_card",
        event_type=payload.get("event", "unknown"),
        payload=json.dumps(payload)
    )
    db.add(log)
    
    # Similar processing as MyNita...
    db.commit()
    return {"status": "received"}


# ================== Admin/Utility Endpoints ==================

@router.post("/verify/{transaction_id}")
async def verify_payment(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """Manually verify a payment with the provider."""
    transaction = db.query(PaymentTransaction).filter(
        PaymentTransaction.transaction_id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    
    provider = get_provider(transaction.provider)
    result = await provider.verify_payment(transaction.provider_transaction_id)
    
    return {
        "transaction_id": transaction_id,
        "verified": result.success,
        "message": result.message
    }


@router.get("/providers")
async def list_providers():
    """List available payment providers."""
    return {
        "providers": [
            {
                "id": "mynita",
                "name": "MyNita",
                "description": "Paiement mobile via MyNita",
                "requires": ["phone_number"],
                "currency": "XOF"
            },
            {
                "id": "bank_card",
                "name": "Carte Bancaire",
                "description": "Paiement par carte de crédit/débit",
                "requires": ["card_number", "card_expiry", "card_cvv"],
                "currency": "XOF"
            },
            {
                "id": "mobile_money",
                "name": "Mobile Money",
                "description": "Paiement via opérateur mobile",
                "requires": ["phone_number"],
                "currency": "XOF"
            }
        ]
    }
