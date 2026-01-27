from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel

from app.core.config import Settings
from app.models.player import Player, RegistrationStatus
from app.models.payment import Payment, PaymentStatus
from app.models.config import AppConfig
from beanie.operators import In

from app.services.email_service import send_approval_email

router = APIRouter(prefix="/api/admin", tags=["admin"])


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    message: str


class PlayerResponse(BaseModel):
    id: str
    # Personal Details
    first_name: str
    last_name: str
    email: str
    phone: str
    residential_area: str
    firm_name: str
    designation: str
    # Cricket Details
    batting_type: str
    bowling_type: str
    wicket_keeper: str
    # Jersey Details
    name_on_jersey: str
    tshirt_size: str
    waist_size: int
    # JYPL Season 8 Details
    played_jypl_s7: str
    jypl_s7_team: str
    # Registration & Payment
    registration_status: str
    payment_status: str | None
    created_at: str | None


async def get_settings(request: Request) -> Settings:
    return request.app.state.settings  # type: ignore[attr-defined]


def verify_admin_credentials(username: str, password: str, settings: Settings) -> bool:
    """Verify admin credentials against environment variables."""
    return (
        username == settings.admin_username
        and password == settings.admin_password
    )


@router.post("/login")
async def admin_login(
    payload: AdminLoginRequest,
    settings: Settings = Depends(get_settings),
):
    """Authenticate admin user."""
    if verify_admin_credentials(payload.username, payload.password, settings):
        return AdminLoginResponse(
            success=True,
            message="Login successful"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.get("/players")
async def get_all_players(
    username: str,
    password: str,
    page: int = 1,
    limit: int = 50,
    settings: Settings = Depends(get_settings),
):
    """Get registered players with pagination (requires authentication)."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Use pagination
    skip = (page - 1) * limit
    
    # Get total count
    total = await Player.find_all().count()

    # Get total paid count (based on registration_status)
    total_paid = await Player.find(Player.registration_status == "PAID").count()
    
    # Fetch players with pagination
    players = await Player.find_all().skip(skip).limit(limit).sort("-created_at").to_list()
    
    # Optimize N+1 query: Fetch all payments for these players in one go
    player_ids = [player.id for player in players]
    payments = await Payment.find(In(Payment.player_id, player_ids)).to_list()
    
    # Create a map for O(1) lookup
    payment_map = {payment.player_id: payment for payment in payments}
    
    result = []
    for player in players:
        payment = payment_map.get(player.id)
        
        result.append(
            PlayerResponse(
                id=str(player.id),
                first_name=player.first_name,
                last_name=player.last_name,
                email=player.email,
                phone=player.phone,
                residential_area=player.residential_area,
                firm_name=player.firm_name,
                designation=player.designation,
                batting_type=player.batting_type,
                bowling_type=player.bowling_type,
                wicket_keeper=player.wicket_keeper,
                name_on_jersey=player.name_on_jersey,
                tshirt_size=player.tshirt_size,
                waist_size=player.waist_size,
                played_jypl_s7=player.played_jypl_s7,
                jypl_s7_team=player.jypl_s7_team,
                registration_status=player.registration_status.value,
                payment_status=payment.status.value if payment else None,
                created_at=player.created_at.isoformat() if player.created_at else None,
            )
        )
    
    return {
        "players": result,
        "total": total,
        "total_paid": total_paid,
        "page": page,
        "limit": limit
    }


@router.get("/players/csv")
async def export_players_csv(
    username: str,
    password: str,
    settings: Settings = Depends(get_settings),
):
    """Export all players as CSV for Google Sheets import."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    import csv
    import io
    from fastapi.responses import StreamingResponse

    players = await Player.find_all().to_list()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Residential Area",
        "Firm/Company",
        "Designation",
        "Batting Type",
        "Bowling Type",
        "Wicket Keeper",
        "Name on Jersey",
        "T-Shirt Size",
        "Waist Size",
        "Played JYPL S8",
        "JYPL S8 Team",
        "Registration Status",
        "Payment Status",
        "Created At",
        "Photo URL",
        "Visiting Card URL"
    ])
    
    # Optimize N+1 query for CSV export as well
    player_ids = [player.id for player in players]
    payments = await Payment.find(In(Payment.player_id, player_ids)).to_list()
    payment_map = {payment.player_id: payment for payment in payments}

    # Write player data
    for player in players:
        payment = payment_map.get(player.id)
        
        writer.writerow([
            str(player.id),
            player.first_name,
            player.last_name,
            player.email,
            player.phone,
            player.residential_area,
            player.firm_name,
            player.designation,
            player.batting_type,
            player.bowling_type,
            player.wicket_keeper,
            player.name_on_jersey,
            player.tshirt_size,
            player.waist_size,
            player.played_jypl_s7,
            player.jypl_s7_team,
            player.registration_status.value,
            payment.status.value if payment else "N/A",
            player.created_at.isoformat() if player.created_at else "",
            player.photo_url,
            player.visiting_card_url
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=players.csv"}
    )


class ConfigResponse(BaseModel):
    registration_open: bool


class ConfigUpdateRequest(BaseModel):
    registration_open: bool


@router.get("/config", response_model=ConfigResponse)
async def get_config(
    username: str,
    password: str,
    settings: Settings = Depends(get_settings),
):
    """Get application configuration (requires authentication)."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    cfg = await AppConfig.find_one({})
    if cfg is None:
        cfg = AppConfig(registration_open=True)
        await cfg.insert()
    return ConfigResponse(registration_open=cfg.registration_open)


@router.post("/config", response_model=ConfigResponse)
async def update_config(
    payload: ConfigUpdateRequest,
    username: str,
    password: str,
    settings: Settings = Depends(get_settings),
):
    """Update application configuration (requires authentication)."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    cfg = await AppConfig.find_one({})
    if cfg is None:
        cfg = AppConfig(registration_open=payload.registration_open)
        await cfg.insert()
    else:
        cfg.registration_open = payload.registration_open
        await cfg.save()
    return ConfigResponse(registration_open=cfg.registration_open)


@router.post("/approve/{player_id}")
async def approve_player(
    player_id: str,
    username: str,
    password: str,
    settings: Settings = Depends(get_settings),
):
    """Approve a waitlisted player and send email."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    try:
        from beanie import PydanticObjectId
        player = await Player.get(PydanticObjectId(player_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Player not found")
        
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
        
    if player.registration_status != RegistrationStatus.WAITLIST:
        raise HTTPException(
            status_code=400,
            detail=f"Player is not in waitlist (Status: {player.registration_status})"
        )
        
    player.registration_status = RegistrationStatus.APPROVED
    await player.save()
    
    # Send email
    await send_approval_email(
        to_email=player.email,
        name=f"{player.first_name} {player.last_name}",
        player_id=str(player.id)
    )
    
    return {"message": "Player approved and email sent"}


@router.post("/reject/{player_id}")
async def reject_player(
    player_id: str,
    username: str,
    password: str,
    settings: Settings = Depends(get_settings),
):
    """Reject a waitlisted player."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    try:
        from beanie import PydanticObjectId
        player = await Player.get(PydanticObjectId(player_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Player not found")
        
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
        
    if player.registration_status != RegistrationStatus.WAITLIST:
        raise HTTPException(
            status_code=400,
            detail=f"Player is not in waitlist (Status: {player.registration_status})"
        )
        
    player.registration_status = RegistrationStatus.REJECTED
    await player.save()
    
    return {"message": "Player rejected"}
