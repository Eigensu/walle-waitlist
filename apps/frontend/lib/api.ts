export type RegisterResponse = {
  player_id: string;
  message: string;
};

export type CreateOrderResponse = {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  player_id: string;
};

export type VerifyPaymentResponse = {
  status: string;
  message: string;
};

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = typeof body?.detail === "string" ? body.detail : "Request failed";
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function registerPlayer(formData: FormData): Promise<RegisterResponse> {
  const res = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });

  return handleJson<RegisterResponse>(res);
}

export async function createOrder(playerId: string): Promise<CreateOrderResponse> {
  const res = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player_id: playerId }),
  });

  return handleJson<CreateOrderResponse>(res);
}

export async function verifyPayment(payload: {
  player_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<VerifyPaymentResponse> {
  const res = await fetch("/api/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleJson<VerifyPaymentResponse>(res);
}
