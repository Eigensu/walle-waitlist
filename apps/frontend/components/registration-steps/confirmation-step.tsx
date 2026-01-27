type ConfirmationStepProps = {
  playerId: string | null;
  status?: string; // "PAID", "WAITLIST", "REJECTED" etc.
};

export function ConfirmationStep({ playerId, status }: ConfirmationStepProps) {
  const isWaitlist = status === "WAITLIST";
  const isRejected = status === "REJECTED";

  let styles = {
    container:
      "border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/40 dark:from-green-950/20 dark:to-slate-800/30",
    iconBg: "bg-green-600 shadow-green-200 dark:shadow-green-950/60",
    textTitle: "text-green-900 dark:text-white",
    textBody: "text-green-700 dark:text-white",
    textId: "text-green-600 dark:text-white",
    title: "Payment Confirmed!",
    body: "Thank you for registering with Walle Arena. Your payment for JYPL SEASON 9 is received.",
  };

  if (isWaitlist) {
    styles = {
      container:
        "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white dark:border-yellow-900/40 dark:from-yellow-950/20 dark:to-slate-800/30",
      iconBg: "bg-yellow-500 shadow-yellow-200 dark:shadow-yellow-950/60",
      textTitle: "text-yellow-900 dark:text-white",
      textBody: "text-yellow-800 dark:text-white",
      textId: "text-yellow-700 dark:text-white",
      title: "Joined Waitlist",
      body: "You have been added to the waitlist. We will notify you once your registration is approved.",
    };
  } else if (isRejected) {
    styles = {
      container:
        "border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-900/40 dark:from-red-950/20 dark:to-slate-800/30",
      iconBg: "bg-red-600 shadow-red-200 dark:shadow-red-950/60",
      textTitle: "text-red-900 dark:text-white",
      textBody: "text-red-800 dark:text-white",
      textId: "text-red-700 dark:text-white",
      title: "Application Rejected",
      body: "We are sorry, but your registration application has been rejected.",
    };
  }

  return (
    <div className={`rounded-2xl border-2 p-6 shadow-lg ${styles.container}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg ${styles.iconBg}`}
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
          ) : isRejected ? (
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
                d="M6 18L18 6M6 6l12 12"
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
          <p className={`text-xl font-bold ${styles.textTitle}`}>
            {styles.title}
          </p>
          <p className={`mt-1 ${styles.textBody}`}>{styles.body}</p>
          <p className={`mt-3 text-sm ${styles.textId}`}>
            Player ID:{" "}
            <span className="font-mono font-semibold">{playerId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
