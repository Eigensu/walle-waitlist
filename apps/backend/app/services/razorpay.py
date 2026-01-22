import hashlib
import hmac
from typing import Any

import httpx
from fastapi import HTTPException, status


class RazorpayService:
    def __init__(self, key_id: str, key_secret: str):
        self.key_id = key_id
        self.key_secret = key_secret
        self.base_url = "https://api.razorpay.com/v1"
        self._client = httpx.AsyncClient(auth=(self.key_id, self.key_secret), timeout=10)

    async def create_order(self, amount: int, currency: str, receipt: str) -> dict[str, Any]:
        payload = {"amount": amount, "currency": currency, "receipt": receipt}
        try:
            response = await self._client.post(f"{self.base_url}/orders", json=payload)
        except httpx.HTTPError as exc:  # network failures
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

        if response.status_code not in (200, 201):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response.text)

        return response.json()

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        body = f"{order_id}|{payment_id}"
        generated = hmac.new(self.key_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(generated, signature)

    async def aclose(self) -> None:
        await self._client.aclose()
