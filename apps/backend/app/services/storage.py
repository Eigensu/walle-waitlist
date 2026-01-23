from pathlib import Path
from typing import Iterable
from uuid import uuid4

import aiofiles
import cloudinary
import cloudinary.uploader
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


class CloudinaryStorageService:
    def __init__(self, cloud_name: str, api_key: str, api_secret: str, folder: str = "uploads"):
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )
        self.folder = folder

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

        # Determine resource type based on content type
        resource_type = "raw"
        if file.content_type and file.content_type.startswith("image/"):
            resource_type = "image"
        elif file.content_type == "application/pdf":
            resource_type = "raw"

        # Generate a unique public_id
        suffix = Path(file.filename or "upload").suffix
        public_id = f"{self.folder}/{uuid4().hex}{suffix}"

        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                content,
                public_id=public_id,
                resource_type=resource_type,
                folder=self.folder
            )
            return result["secure_url"]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file to Cloudinary: {str(e)}"
            )


class UnsupportedStorageMode(Exception):
    """Raised when an unsupported storage mode is requested."""


def build_storage_service(
    mode: str, 
    uploads_dir: Path, 
    base_url: str,
    cloudinary_cloud_name: str | None = None,
    cloudinary_api_key: str | None = None,
    cloudinary_api_secret: str | None = None,
    cloudinary_folder: str = "uploads"
) -> StorageService | CloudinaryStorageService:
    if mode == "local":
        return StorageService(uploads_dir, base_url)
    elif mode == "cloudinary":
        if not all([cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret]):
            raise UnsupportedStorageMode("Cloudinary credentials not configured")
        return CloudinaryStorageService(
            cloudinary_cloud_name, 
            cloudinary_api_key, 
            cloudinary_api_secret,
            cloudinary_folder
        )
    else:
        raise UnsupportedStorageMode(f"Storage mode '{mode}' not implemented in this build")
