export type RegisterResponse = {
  player_id: string;
  message: string;
  status?: string;
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

export type ResumePaymentResponse = {
  player_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  registration_status: string;
  message: string;
};

export type PlayerDetailsResponse = {
  player_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  residential_area: string;
  firm_name: string;
  designation: string;
  photo_url: string;
  visiting_card_url: string;
  batting_type: string;
  bowling_type: string;
  wicket_keeper: string;
  name_on_jersey: string;
  tshirt_size: string;
  waist_size: number;
  played_jypl_s7: string;
  jypl_s7_team: string;
  registration_status: string;
};

export type PublicConfig = {
  registration_open: boolean;
  registration_cap_reached: boolean;
  current_registrations: number;
  registration_cap: number;
};
export type AdminConfig = { registration_open: boolean };

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail =
      typeof body?.detail === "string" ? body.detail : "Request failed";
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function registerPlayer(
  formData: FormData,
): Promise<RegisterResponse> {
  const res = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });

  return handleJson<RegisterResponse>(res);
}

export async function updatePlayer(
  playerId: string,
  formData: FormData,
): Promise<RegisterResponse> {
  const res = await fetch(`/api/player/${playerId}`, {
    method: "PUT",
    body: formData,
  });

  return handleJson<RegisterResponse>(res);
}

export async function createOrder(
  playerId: string,
): Promise<CreateOrderResponse> {
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

export async function resumePayment(
  email: string,
): Promise<ResumePaymentResponse> {
  const res = await fetch("/api/resume-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return handleJson<ResumePaymentResponse>(res);
}

export async function getPlayerDetails(
  playerId: string,
): Promise<PlayerDetailsResponse> {
  const res = await fetch(`/api/player/${playerId}`);
  return handleJson<PlayerDetailsResponse>(res);
}

export async function getPublicConfig(): Promise<PublicConfig> {
  const res = await fetch("/api/config", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return handleJson<PublicConfig>(res);
}

export async function adminGetConfig(
  username: string,
  password: string,
): Promise<AdminConfig> {
  const url = `/api/admin/config?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(url);
  return handleJson<AdminConfig>(res);
}

export async function adminUpdateConfig(
  username: string,
  password: string,
  registration_open: boolean,
): Promise<AdminConfig> {
  const url = `/api/admin/config?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registration_open }),
  });
  return handleJson<AdminConfig>(res);
}

export async function approvePlayer(
  playerId: string,
  username: string,
  pass: string,
): Promise<{ message: string }> {
  const url = `/api/admin/approve/${playerId}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)}`;
  const res = await fetch(url, {
    method: "POST",
  });
  return handleJson<{ message: string }>(res);
}

export async function rejectPlayer(
  playerId: string,
  username: string,
  pass: string,
): Promise<{ message: string }> {
  const url = `/api/admin/reject/${playerId}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)}`;
  const res = await fetch(url, {
    method: "POST",
  });
  return handleJson<{ message: string }>(res);
}

export async function adminResendEmail(
  playerId: string,
  username: string,
  pass: string,
): Promise<{ message: string }> {
  const url = `/api/admin/resend-email/${playerId}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)}`;
  const res = await fetch(url, {
    method: "POST",
  });
  return handleJson<{ message: string }>(res);
}
