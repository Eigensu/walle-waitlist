from datetime import datetime, timezone
from enum import Enum

from beanie import Document, Indexed
from pydantic import EmailStr, Field
from pydantic.config import ConfigDict


class RegistrationStatus(str, Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    PAID = "PAID"
    FAILED = "FAILED"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Player(Document):
    first_name: str
    last_name: str
    email: Indexed(EmailStr, unique=True)  # type: ignore[assignment]
    phone: Indexed(str, unique=True)  # type: ignore[assignment]
    residential_area: str
    firm_name: str
    designation: str
    photo_url: str
    visiting_card_url: str
    registration_status: RegistrationStatus = RegistrationStatus.PENDING_PAYMENT
    created_at: datetime = Field(default_factory=utc_now)

    model_config = ConfigDict(str_strip_whitespace=True)

    class Settings:
        name = "players"
        indexes = [
            "email",
            "phone",
            "-created_at",
        ]
