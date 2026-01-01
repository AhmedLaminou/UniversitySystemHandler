from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass


@dataclass
class PaymentResult:
    success: bool
    transaction_id: str
    provider_reference: Optional[str] = None
    redirect_url: Optional[str] = None
    message: str = ""
    error_code: Optional[str] = None


class PaymentProvider(ABC):
    """Abstract base class for payment providers."""
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the name of the provider."""
        pass

    @abstractmethod
    async def initiate_payment(
        self,
        amount: float,
        currency: str,
        transaction_id: str,
        description: str,
        **kwargs
    ) -> PaymentResult:
        """Initiate a payment with the provider."""
        pass

    @abstractmethod
    async def verify_payment(self, provider_reference: str) -> PaymentResult:
        """Verify the status of a payment."""
        pass

    @abstractmethod
    async def refund_payment(
        self, 
        provider_reference: str, 
        amount: Optional[float] = None
    ) -> PaymentResult:
        """Refund a payment (full or partial)."""
        pass
