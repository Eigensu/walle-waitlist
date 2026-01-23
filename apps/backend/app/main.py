from contextlib import asynccontextmanager
from pathlib import Path

from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import get_settings
from app.models.payment import Payment
from app.models.player import Player
from app.routers import payments, registration, admin
from app.services.razorpay import RazorpayService
from app.services.storage import build_storage_service

settings = get_settings()
UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(settings.mongo_url)
    database = client[settings.mongo_db]
    await init_beanie(database=database, document_models=[Player, Payment])

    storage = build_storage_service(
        settings.storage_mode, 
        UPLOADS_DIR, 
        base_url="/uploads",
        cloudinary_cloud_name=settings.cloudinary_cloud_name,
        cloudinary_api_key=settings.cloudinary_api_key,
        cloudinary_api_secret=settings.cloudinary_api_secret,
        cloudinary_folder=settings.cloudinary_folder
    )
    razorpay = RazorpayService(settings.razorpay_key_id, settings.razorpay_key_secret)

    app.state.storage = storage
    app.state.settings = settings
    app.state.razorpay = razorpay

    yield

    await razorpay.aclose()
    client.close()


app = FastAPI(title="Walle Registration", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(registration.router)
app.include_router(payments.router)
app.include_router(admin.router)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
