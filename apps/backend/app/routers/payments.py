from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from beanie import PydanticObjectId

from app.core.config import Settings
from app.models.payment import Payment, PaymentStatus
from app.models.player import Player, RegistrationStatus
from app.services.razorpay import RazorpayService

router = APIRouter(prefix="/api/payments", tags=["payments"])


class CreateOrderRequest(BaseModel):
    player_id: str


class CreateOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int
    currency: str
    player_id: str


class VerifyPaymentRequest(BaseModel):
    player_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    status: str
    message: str


async def get_settings(request: Request) -> Settings:
    return request.app.state.settings  # type: ignore[attr-defined]


async def get_razorpay(request: Request) -> RazorpayService:
    return request.app.state.razorpay  # type: ignore[attr-defined]


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    payload: CreateOrderRequest,
    settings: Settings = Depends(get_settings),
    razorpay: RazorpayService = Depends(get_razorpay),
):
    player_id = PydanticObjectId(payload.player_id)
    player = await Player.get(player_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    if player.registration_status == RegistrationStatus.PAID:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already paid")

    existing_payment = await Payment.find_one(Payment.player_id == player_id, Payment.status == PaymentStatus.CAPTURED)
    if existing_payment:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Payment already captured")

    amount_paise = settings.registration_fee_inr * 100
    order = await razorpay.create_order(amount=amount_paise, currency="INR", receipt=str(player.id))

    payment = Payment(
        player_id=player_id,
        razorpay_order_id=order.get("id"),
        amount=amount_paise,
        currency="INR",
        status=PaymentStatus.CREATED,
    )
    await payment.insert()

    return CreateOrderResponse(
        razorpay_order_id=payment.razorpay_order_id,
        amount=payment.amount,
        currency=payment.currency,
        player_id=str(player.id),
    )


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(
    payload: VerifyPaymentRequest,
    settings: Settings = Depends(get_settings),
    razorpay: RazorpayService = Depends(get_razorpay),
):
    player_id = PydanticObjectId(payload.player_id)

    payment = await Payment.find_one(Payment.razorpay_order_id == payload.razorpay_order_id, Payment.player_id == player_id)
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")

    is_valid = razorpay.verify_signature(
        order_id=payload.razorpay_order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature,
    )

    if not is_valid:
        payment.status = PaymentStatus.FAILED
        payment.razorpay_payment_id = payload.razorpay_payment_id
        payment.razorpay_signature = payload.razorpay_signature
        await payment.save()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

    payment.status = PaymentStatus.CAPTURED
    payment.razorpay_payment_id = payload.razorpay_payment_id
    payment.razorpay_signature = payload.razorpay_signature
    await payment.save()

    player = await Player.get(player_id)
    if player:
        player.registration_status = RegistrationStatus.PAID
        await player.save()

    return VerifyPaymentResponse(status="CAPTURED", message="Payment verified")


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    settings: Settings = Depends(get_settings),
    razorpay: RazorpayService = Depends(get_razorpay),
):
    """Handle Razorpay webhook events."""
    if not settings.razorpay_webhook_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured"
        )

    # Get signature and body
    signature = request.headers.get("X-Razorpay-Signature")
    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing signature header"
        )

    body_bytes = await request.body()

    # Verify signature
    is_valid = razorpay.verify_webhook_signature(
        body=body_bytes,
        signature=signature,
        webhook_secret=settings.razorpay_webhook_secret
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature"
        )

    # Parse event
    payload = await request.json()
    event_type = payload.get("event")

    # Handle payment.captured event
    if event_type == "payment.captured":
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if not order_id or not payment_id:
            return {"status": "ignored", "reason": "missing order_id or payment_id"}

        # Find payment by order ID
        payment = await Payment.find_one(Payment.razorpay_order_id == order_id)
        if not payment:
            return {"status": "ignored", "reason": "payment record not found"}

        # Update payment status
        payment.status = PaymentStatus.CAPTURED
        payment.razorpay_payment_id = payment_id
        await payment.save()

        # Update player status
        player = await Player.get(payment.player_id)
        if player:
            player.registration_status = RegistrationStatus.PAID
            await player.save()

    return {"status": "ok"}
