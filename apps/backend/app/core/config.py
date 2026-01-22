"""Basic environment bootstrap shared by backend and frontend.

Loads the root-level .env so backend settings are available without
duplicating files under backend/.env.
"""

from pathlib import Path

from dotenv import load_dotenv


ROOT_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"

# Load once at startup; override=False so process env wins when provided.
load_dotenv(ROOT_ENV_PATH, override=False)


def env_path() -> str:
	"""Expose resolved env path for debugging/logging."""

	return str(ROOT_ENV_PATH)
