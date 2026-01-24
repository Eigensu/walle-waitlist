from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError

from app.models.player import Player, RegistrationStatus
from app.models.config import AppConfig
from app.services.storage import StorageService

router = APIRouter(prefix="/api", tags=["registration"])

MAX_FILE_BYTES = 10 * 1024 * 1024
PHOTO_MIMES = {"image/jpeg", "image/png", "image/heic", "image/heif"}
CARD_MIMES = {"image/jpeg", "image/png", "image/heic", "image/heif", "application/pdf"}


class RegisterResponse(BaseModel):
    player_id: str
    message: str = "Details Saved"


async def get_storage(request: Request) -> StorageService:
    return request.app.state.storage  # type: ignore[attr-defined]


@router.post("/register", response_model=RegisterResponse)
async def register_player(
    # Personal Details
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    residential_area: str = Form(...),
    firm_name: str = Form(...),
    designation: str = Form(...),
    photo: UploadFile = File(...),
    visiting_card: UploadFile = File(...),
    # Cricket Details
    batting_type: str = Form(...),
    bowling_type: str = Form(...),
    wicket_keeper: str = Form(...),
    # Jersey Details
    name_on_jersey: str = Form(...),
    tshirt_size: str = Form(...),
    waist_size: int = Form(...),
    # JYPL Season 7 Details
    played_jypl_s7: str = Form(...),
    jypl_s7_team: str = Form(default=""),
    storage: StorageService = Depends(get_storage),
):
    # Check registration status
    cfg = await AppConfig.find_one({})
    if cfg and not cfg.registration_open:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Registration is currently closed")

    # Basic phone validation: require at least 10 digits (ignoring formatting)
    digit_only_phone = "".join(ch for ch in phone if ch.isdigit())
    if len(digit_only_phone) < 10:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Phone must have at least 10 digits")

    # Duplicate checks
    if await Player.find_one(Player.email == email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    if await Player.find_one(Player.phone == phone):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already registered")

    photo_url = await storage.save_upload(photo, PHOTO_MIMES, MAX_FILE_BYTES)
    card_url = await storage.save_upload(visiting_card, CARD_MIMES, MAX_FILE_BYTES)

    player = Player(
        # Personal Details
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        residential_area=residential_area,
        firm_name=firm_name,
        designation=designation,
        photo_url=photo_url,
        visiting_card_url=card_url,
        # Cricket Details
        batting_type=batting_type,
        bowling_type=bowling_type,
        wicket_keeper=wicket_keeper,
        # Jersey Details
        name_on_jersey=name_on_jersey,
        tshirt_size=tshirt_size,
        waist_size=waist_size,
        # JYPL Season 7 Details
        played_jypl_s7=played_jypl_s7,
        jypl_s7_team=jypl_s7_team,
        registration_status=RegistrationStatus.PENDING_PAYMENT,
        created_at=datetime.now(timezone.utc),
    )

    try:
        await player.insert()
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate email or phone") from exc

    return RegisterResponse(player_id=str(player.id), message="Details Saved")


class PublicConfigResponse(BaseModel):
    registration_open: bool


@router.get("/config", response_model=PublicConfigResponse)
async def get_public_config():
    """Public endpoint: expose registration open/closed status for frontend."""
    cfg = await AppConfig.find_one({})
    if cfg is None:
        # default open
        return PublicConfigResponse(registration_open=True)
    return PublicConfigResponse(registration_open=cfg.registration_open)
