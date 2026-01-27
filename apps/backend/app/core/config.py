"""Application settings and environment bootstrap."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from pydantic import EmailStr, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# Locate the nearest .env walking upward; fall back to CWD/.env
_env_candidates = [p / ".env" for p in Path(__file__).resolve().parents]
ROOT_ENV_PATH = next((p for p in _env_candidates if p.exists()), Path(".env"))
load_dotenv(ROOT_ENV_PATH, override=False)


class Settings(BaseSettings):
	mongo_url: str = Field(..., alias="MONGO_URL")
	mongo_db: str = Field(..., alias="MONGO_DB")
	cors_origins: str | list[str] = Field(default_factory=list, alias="CORS_ORIGINS")

	razorpay_key_id: str = Field(..., alias="RAZORPAY_KEY_ID")
	razorpay_key_secret: str = Field(..., alias="RAZORPAY_KEY_SECRET")
	razorpay_webhook_secret: str | None = Field(default=None, alias="RAZORPAY_WEBHOOK_SECRET")

	registration_fee_inr: int = Field(default=15000, alias="REGISTRATION_FEE_INR")

	storage_mode: Literal["local", "s3", "cloudinary"] = Field(default="local", alias="STORAGE_MODE")
	s3_bucket: str | None = Field(default=None, alias="S3_BUCKET")
	s3_region: str | None = Field(default=None, alias="S3_REGION")
	s3_access_key_id: str | None = Field(default=None, alias="S3_ACCESS_KEY_ID")
	s3_secret_access_key: str | None = Field(default=None, alias="S3_SECRET_ACCESS_KEY")

	cloudinary_cloud_name: str | None = Field(default=None, alias="CLOUDINARY_CLOUD_NAME")
	cloudinary_api_key: str | None = Field(default=None, alias="CLOUDINARY_API_KEY")
	cloudinary_api_secret: str | None = Field(default=None, alias="CLOUDINARY_API_SECRET")
	cloudinary_folder: str = Field(default="walle-register", alias="CLOUDINARY_FOLDER")

	admin_username: str = Field(default="admin", alias="ADMIN_USERNAME")
	admin_password: str = Field(..., alias="ADMIN_PASSWORD")

	# Email Settings
	resend_api_key: str | None = Field(default=None, alias="RESEND_API_KEY")

	model_config = SettingsConfigDict(
		env_file=ROOT_ENV_PATH,
		env_file_encoding="utf-8",
		extra="ignore",
	)

	@field_validator("cors_origins", mode="before")
	@classmethod
	def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
		"""Convert comma-separated or JSON-array-like string to list."""
		if isinstance(value, list):
			return value
		if not value:
			return []
		value = value.strip()
		if not value:
			return []
		# Accept JSON-style list or fall back to comma separation
		if value.startswith("[") and value.endswith("]"):
			# Remove brackets and split by comma
			inner = value[1:-1].strip()
			if not inner:
				return []
			return [v.strip().strip('"\'') for v in inner.split(",") if v.strip()]
		# Simple comma-separated list
		return [v.strip() for v in value.split(",") if v.strip()]


@lru_cache
def get_settings() -> Settings:
	return Settings()  # type: ignore[call-arg]


def env_path() -> str:
	return str(ROOT_ENV_PATH)
