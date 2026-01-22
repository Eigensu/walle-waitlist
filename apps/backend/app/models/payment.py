from datetime import datetime, timezone
from enum import Enum

from beanie import Document, Indexed
from beanie.odm.fields import PydanticObjectId
from pydantic import Field
from pydantic.config import ConfigDict


class PaymentStatus(str, Enum):
    CREATED = "CREATED"
    CAPTURED = "CAPTURED"
    FAILED = "FAILED"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Payment(Document):
    player_id: PydanticObjectId
    razorpay_order_id: Indexed(str, unique=True)  # type: ignore[assignment]
    razorpay_payment_id: str | None = None
    razorpay_signature: str | None = None
    status: PaymentStatus = PaymentStatus.CREATED
    amount: int
    currency: str = "INR"
    created_at: datetime = Field(default_factory=utc_now)

    model_config = ConfigDict(str_strip_whitespace=True)

    class Settings:
        name = "payments"
        indexes = [
            "player_id",
            "razorpay_order_id",
            "status",
            "-created_at",
        ]
