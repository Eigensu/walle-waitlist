"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateOrderResponse } from "@/lib/api";

// Minimal Razorpay typings to keep TS happy.
type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  handler: (response: RazorpayHandlerResponse) => void;
  retry?: { enabled: boolean; max_count?: number };
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  order: CreateOrderResponse | null;
  playerName: string;
  contact?: { email?: string; phone?: string };
  onSuccess: (payload: RazorpayHandlerResponse) => void;
  onFailure?: (message: string) => void;
  onDismiss?: () => void;
};

export function PaymentModal({
  open,
  onClose,
  order,
  playerName,
  contact,
  onSuccess,
  onFailure,
  onDismiss,
}: PaymentModalProps) {
  const [loadingScript, setLoadingScript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = useMemo(() => process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "", []);

  const loadScript = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;

    setLoadingScript(true);
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    }).catch((err) => setError(err.message));
    setLoadingScript(false);
  }, []);

  const openCheckout = useCallback(async () => {
    if (!order) return;
    if (!key) {
      setError("Razorpay key missing. Set NEXT_PUBLIC_RAZORPAY_KEY_ID.");
      onFailure?.("Missing Razorpay key");
      return;
    }

    await loadScript();
    if (!window.Razorpay) {
      setError("Unable to initialize Razorpay. Please retry.");
      onFailure?.("Razorpay unavailable");
      return;
    }

    const checkout = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Walle Arena Registration",
      description: "Player registration fee",
      order_id: order.razorpay_order_id,
      prefill: {
        name: playerName,
        email: contact?.email,
        contact: contact?.phone ?? "",
      },
      retry: { enabled: false },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          onFailure?.("Payment cancelled");
        },
      },
      handler: onSuccess,
      theme: { color: "#2563EB" },
    });

    checkout.open();
  }, [
    contact?.email,
    contact?.phone,
    key,
    loadScript,
    onFailure,
    onDismiss,
    onSuccess,
    order,
    playerName,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss?.();
          onClose();
        }
      }}
    >
      <DialogContent className="border-2 border-blue-200 max-w-sm dark:border-blue-800 dark:bg-slate-900">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CreditCard className="size-4" />
            </div>
            <span className="text-slate-900 dark:text-white">
              Secure Payment
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 dark:text-slate-400">
            We use Razorpay for secure payment processing. Your card details are
            never stored on our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 px-3 py-3 dark:border-blue-900/40 dark:from-slate-800 dark:to-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                Total Amount
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-white">
                ₹{order ? (order.amount / 100).toLocaleString() : "--"}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-300 dark:shadow-blue-900/50">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/40 dark:bg-red-900/20">
              <AlertCircle className="mt-0.5 size-4 text-red-600 dark:text-red-400 shrink-0" />
              <span className="text-xs font-medium text-red-900 dark:text-red-300">
                {error}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border dark:border-blue-900/40">
            <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">
              256-bit SSL encrypted checkout powered by Razorpay
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onDismiss?.();
              onClose();
            }}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 dark:shadow-none h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={openCheckout}
            disabled={!order || loadingScript}
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-blue-900/50 dark:bg-blue-700 dark:hover:bg-blue-800 h-9 text-sm"
          >
            {loadingScript ? "Preparing..." : "Pay with Razorpay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
