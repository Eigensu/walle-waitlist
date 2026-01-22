from fastapi import FastAPI

from app.core import config as _config  # noqa: F401  # triggers env load


app = FastAPI(title="Walle Registration", version="0.1.0")


@app.get("/health")
async def health():
	return {"status": "ok"}
