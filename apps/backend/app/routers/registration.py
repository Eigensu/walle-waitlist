from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError

from app.models.player import Player, RegistrationStatus
from app.services.storage import StorageService

router = APIRouter(prefix="/api", tags=["registration"])

MAX_FILE_BYTES = 5 * 1024 * 1024
PHOTO_MIMES = {"image/jpeg", "image/png"}
CARD_MIMES = {"image/jpeg", "image/png", "application/pdf"}


class RegisterResponse(BaseModel):
    player_id: str
    message: str = "Details Saved"


async def get_storage(request: Request) -> StorageService:
    return request.app.state.storage  # type: ignore[attr-defined]


@router.post("/register", response_model=RegisterResponse)
async def register_player(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    residential_area: str = Form(...),
    firm_name: str = Form(...),
    designation: str = Form(...),
    photo: UploadFile = File(...),
    visiting_card: UploadFile = File(...),
    storage: StorageService = Depends(get_storage),
):
    # Duplicate checks
    if await Player.find_one(Player.email == email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    if await Player.find_one(Player.phone == phone):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already registered")

    photo_url = await storage.save_upload(photo, PHOTO_MIMES, MAX_FILE_BYTES)
    card_url = await storage.save_upload(visiting_card, CARD_MIMES, MAX_FILE_BYTES)

    player = Player(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        residential_area=residential_area,
        firm_name=firm_name,
        designation=designation,
        photo_url=photo_url,
        visiting_card_url=card_url,
        registration_status=RegistrationStatus.PENDING_PAYMENT,
        created_at=datetime.now(timezone.utc),
    )

    try:
        await player.insert()
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate email or phone") from exc

    return RegisterResponse(player_id=str(player.id), message="Details Saved")
