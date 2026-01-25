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


class ResumePaymentResponse(BaseModel):
    player_id: str
    email: str
    first_name: str
    last_name: str
    phone: str
    registration_status: str
    message: str


class ResumePaymentRequest(BaseModel):
    email: str


class PlayerDetailsResponse(BaseModel):
    player_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    residential_area: str
    firm_name: str
    designation: str
    photo_url: str
    visiting_card_url: str
    batting_type: str
    bowling_type: str
    wicket_keeper: str
    name_on_jersey: str
    tshirt_size: str
    waist_size: int
    played_jypl_s7: str
    jypl_s7_team: str
    registration_status: str


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
    # JYPL Season 8 Details
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
        # JYPL Season 8 Details
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


@router.put("/player/{player_id}", response_model=RegisterResponse)
async def update_player(
    player_id: str,
    # Personal Details
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    residential_area: str = Form(...),
    firm_name: str = Form(...),
    designation: str = Form(...),
    photo: UploadFile = File(None),
    visiting_card: UploadFile = File(None),
    # Cricket Details
    batting_type: str = Form(...),
    bowling_type: str = Form(...),
    wicket_keeper: str = Form(...),
    # Jersey Details
    name_on_jersey: str = Form(...),
    tshirt_size: str = Form(...),
    waist_size: int = Form(...),
    # JYPL Season 8 Details
    played_jypl_s7: str = Form(...),
    jypl_s7_team: str = Form(default=""),
    storage: StorageService = Depends(get_storage),
):
    """Update existing player details"""
    try:
        from beanie import PydanticObjectId
        player = await Player.get(PydanticObjectId(player_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )

    # Basic phone validation
    digit_only_phone = "".join(ch for ch in phone if ch.isdigit())
    if len(digit_only_phone) < 10:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Phone must have at least 10 digits")

    # Check for duplicate email/phone (excluding current player)
    if email != player.email:
        if await Player.find_one(Player.email == email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    if phone != player.phone:
        if await Player.find_one(Player.phone == phone):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already registered")

    # Update fields
    player.first_name = first_name
    player.last_name = last_name
    player.email = email
    player.phone = phone
    player.residential_area = residential_area
    player.firm_name = firm_name
    player.designation = designation
    player.batting_type = batting_type
    player.bowling_type = bowling_type
    player.wicket_keeper = wicket_keeper
    player.name_on_jersey = name_on_jersey
    player.tshirt_size = tshirt_size
    player.waist_size = waist_size
    player.played_jypl_s7 = played_jypl_s7
    player.jypl_s7_team = jypl_s7_team

    # Update files only if new ones are provided
    if photo and photo.filename:
        player.photo_url = await storage.save_upload(photo, PHOTO_MIMES, MAX_FILE_BYTES)
    if visiting_card and visiting_card.filename:
        player.visiting_card_url = await storage.save_upload(visiting_card, CARD_MIMES, MAX_FILE_BYTES)

    await player.save()
    return RegisterResponse(player_id=str(player.id), message="Details Updated")


@router.post("/resume-payment", response_model=ResumePaymentResponse)
async def resume_payment(request: ResumePaymentRequest):
    """Check if a player with pending payment exists and return their details"""
    player = await Player.find_one(Player.email == request.email)
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registration found with this email"
        )
    
    if player.registration_status == RegistrationStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already completed for this email"
        )
    
    return ResumePaymentResponse(
        player_id=str(player.id),
        email=player.email,
        first_name=player.first_name,
        last_name=player.last_name,
        phone=player.phone,
        registration_status=player.registration_status.value,
        message="Resume payment available"
    )


@router.get("/player/{player_id}", response_model=PlayerDetailsResponse)
async def get_player_details(player_id: str):
    """Get player details by ID for resume/edit functionality"""
    try:
        from beanie import PydanticObjectId
        player = await Player.get(PydanticObjectId(player_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    return PlayerDetailsResponse(
        player_id=str(player.id),
        first_name=player.first_name,
        last_name=player.last_name,
        email=player.email,
        phone=player.phone,
        residential_area=player.residential_area,
        firm_name=player.firm_name,
        designation=player.designation,
        photo_url=player.photo_url,
        visiting_card_url=player.visiting_card_url,
        batting_type=player.batting_type,
        bowling_type=player.bowling_type,
        wicket_keeper=player.wicket_keeper,
        name_on_jersey=player.name_on_jersey,
        tshirt_size=player.tshirt_size,
        waist_size=player.waist_size,
        played_jypl_s7=player.played_jypl_s7,
        jypl_s7_team=player.jypl_s7_team,
        registration_status=player.registration_status.value,
    )


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
