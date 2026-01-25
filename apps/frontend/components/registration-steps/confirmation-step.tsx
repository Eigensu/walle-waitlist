type ConfirmationStepProps = {
  playerId: string | null;
};

export function ConfirmationStep({ playerId }: ConfirmationStepProps) {
  return (
    <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg dark:border-green-900/40 dark:from-green-950/20 dark:to-slate-800/30">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-950/60">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-green-900 dark:text-white">
            Payment Confirmed!
          </p>
          <p className="mt-1 text-green-700 dark:text-white">
            Thank you for registering with Walle Arena your payment for JYPL
            SEASON 9 is received
          </p>
          <p className="mt-3 text-sm text-green-600 dark:text-white">
            Player ID:{" "}
            <span className="font-mono font-semibold">{playerId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
