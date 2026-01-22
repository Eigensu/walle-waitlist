"""Application settings and environment bootstrap."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# Locate the nearest .env walking upward; fall back to ./env at runtime.
ROOT_ENV_PATH = next(
	(p / ".env") for p in Path(__file__).resolve().parents if (p / ".env").exists()
)
load_dotenv(ROOT_ENV_PATH, override=False)


class Settings(BaseSettings):
	mongo_url: str = Field(..., alias="MONGO_URL")
	mongo_db: str = Field(..., alias="MONGO_DB")
	cors_origins: list[str] = Field(default_factory=list, alias="CORS_ORIGINS")

	razorpay_key_id: str = Field(..., alias="RAZORPAY_KEY_ID")
	razorpay_key_secret: str = Field(..., alias="RAZORPAY_KEY_SECRET")
	razorpay_webhook_secret: str | None = Field(default=None, alias="RAZORPAY_WEBHOOK_SECRET")

	registration_fee_inr: int = Field(default=12500, alias="REGISTRATION_FEE_INR")

	storage_mode: Literal["local", "s3"] = Field(default="local", alias="STORAGE_MODE")
	s3_bucket: str | None = Field(default=None, alias="S3_BUCKET")
	s3_region: str | None = Field(default=None, alias="S3_REGION")
	s3_access_key_id: str | None = Field(default=None, alias="S3_ACCESS_KEY_ID")
	s3_secret_access_key: str | None = Field(default=None, alias="S3_SECRET_ACCESS_KEY")

	model_config = SettingsConfigDict(
		env_file=ROOT_ENV_PATH,
		env_file_encoding="utf-8",
		extra="ignore",
	)


@lru_cache
def get_settings() -> Settings:
	return Settings()


def env_path() -> str:
	return str(ROOT_ENV_PATH)
