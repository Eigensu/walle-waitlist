from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel

from app.core.config import Settings
from app.models.player import Player, RegistrationStatus
from app.models.payment import Payment, PaymentStatus

router = APIRouter(prefix="/api/admin", tags=["admin"])


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    message: str


class PlayerResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    residential_area: str
    firm_name: str
    designation: str
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
    settings: Settings = Depends(get_settings),
):
    """Get all registered players (requires authentication)."""
    if not verify_admin_credentials(username, password, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    players = await Player.find_all().to_list()
    
    result = []
    for player in players:
        payment = await Payment.find_one(
            Payment.player_id == player.id
        )
        
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
                registration_status=player.registration_status.value,
                payment_status=payment.status.value if payment else None,
                created_at=player.created_at.isoformat() if player.created_at else None,
            )
        )
    
    return {"players": result, "total": len(result)}


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
        "Registration Status",
        "Payment Status",
        "Created At"
    ])
    
    # Write player data
    for player in players:
        payment = await Payment.find_one(
            Payment.player_id == player.id
        )
        
        writer.writerow([
            str(player.id),
            player.first_name,
            player.last_name,
            player.email,
            player.phone,
            player.residential_area,
            player.firm_name,
            player.designation,
            player.registration_status.value,
            payment.status.value if payment else "N/A",
            player.created_at.isoformat() if player.created_at else "",
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=players.csv"}
    )
