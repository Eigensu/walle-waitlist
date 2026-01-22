from pathlib import Path
from typing import Iterable
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status


class StorageService:
    def __init__(self, base_dir: Path, base_url: str):
        self.base_dir = base_dir
        self.base_url = base_url.rstrip("/") + "/"
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, file: UploadFile, allowed_mimes: Iterable[str], max_bytes: int) -> str:
        if file.content_type not in allowed_mimes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file.content_type}",
            )

        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty")

        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File exceeds maximum allowed size",
            )

        suffix = Path(file.filename or "upload").suffix or self._infer_suffix(file.content_type)
        filename = f"{uuid4().hex}{suffix}"
        target = self.base_dir / filename

        async with aiofiles.open(target, "wb") as buffer:
            await buffer.write(content)

        return f"{self.base_url}{filename}"

    @staticmethod
    def _infer_suffix(content_type: str | None) -> str:
        if not content_type:
            return ""
        mapping = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "application/pdf": ".pdf",
        }
        return mapping.get(content_type, "")


class UnsupportedStorageMode(Exception):
    """Raised when an unsupported storage mode is requested."""


def build_storage_service(mode: str, uploads_dir: Path, base_url: str) -> StorageService:
    if mode != "local":
        raise UnsupportedStorageMode(f"Storage mode '{mode}' not implemented in this build")
    return StorageService(uploads_dir, base_url)
