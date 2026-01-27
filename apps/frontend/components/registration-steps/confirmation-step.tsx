type ConfirmationStepProps = {
  playerId: string | null;
  status?: string; // "PAID", "WAITLIST", etc.
};

export function ConfirmationStep({ playerId, status }: ConfirmationStepProps) {
  const isWaitlist = status === "WAITLIST";

  return (
    <div
      className={`rounded-2xl border-2 p-6 shadow-lg ${
        isWaitlist
          ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white dark:border-yellow-900/40 dark:from-yellow-950/20 dark:to-slate-800/30"
          : "border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/40 dark:from-green-950/20 dark:to-slate-800/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg ${
            isWaitlist
              ? "bg-yellow-500 shadow-yellow-200 dark:shadow-yellow-950/60"
              : "bg-green-600 shadow-green-200 dark:shadow-green-950/60"
          }`}
        >
          {isWaitlist ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
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
          )}
        </div>
        <div>
          <p
            className={`text-xl font-bold ${
              isWaitlist
                ? "text-yellow-900 dark:text-white"
                : "text-green-900 dark:text-white"
            }`}
          >
            {isWaitlist ? "Joined Waitlist" : "Payment Confirmed!"}
          </p>
          <p
            className={`mt-1 ${
              isWaitlist
                ? "text-yellow-800 dark:text-white"
                : "text-green-700 dark:text-white"
            }`}
          >
            {isWaitlist
              ? "You have been added to the waitlist. We will notify you once your registration is approved."
              : "Thank you for registering with Walle Arena. Your payment for JYPL SEASON 9 is received."}
          </p>
          <p
            className={`mt-3 text-sm ${
              isWaitlist
                ? "text-yellow-700 dark:text-white"
                : "text-green-600 dark:text-white"
            }`}
          >
            Player ID:{" "}
            <span className="font-mono font-semibold">{playerId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
