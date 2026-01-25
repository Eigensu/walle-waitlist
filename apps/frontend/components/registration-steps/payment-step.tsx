import { type CreateOrderResponse } from "@/lib/api";

type PaymentStepProps = {
  playerName: string;
  order: CreateOrderResponse | null;
  onEditDetails: () => void;
};

export function PaymentStep({
  playerName,
  order,
  onEditDetails,
}: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-lg dark:border-blue-900/40 dark:from-blue-950/20 dark:via-slate-800/30 dark:to-slate-800/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-white">
              Player Name
            </p>
            <p className="mt-1 text-lg font-semibold text-blue-900 dark:text-white">
              {playerName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-white">
              Registration Fee
            </p>
            <p className="mt-1 text-3xl font-bold text-blue-900 dark:text-white">
              ₹{order ? (order.amount / 100).toLocaleString() : "15,000"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-blue-900 dark:text-white">
              Ready to complete payment
            </p>
            <p className="mt-1 text-blue-700 dark:text-white">
              Click proceed to open the secure Razorpay checkout. You will
              return here for confirmation after payment.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              Need to update your details?
            </p>
            <p className="mt-1 text-amber-700 dark:text-amber-300">
              You can go back and edit any information before making payment.
            </p>
            <button
              type="button"
              onClick={onEditDetails}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Edit Registration Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
