type Step = {
  id: string;
  label: string;
  helper?: string;
};

type StepperProps = {
  steps: Step[];
  activeIndex: number;
};

export function Stepper({ steps, activeIndex }: StepperProps) {
  const safeActive = Math.min(activeIndex, steps.length - 1);
  const finishedAll = activeIndex >= steps.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      {/* Mobile view - vertical stack */}
      <ol className="flex flex-col gap-3 sm:hidden">
        {steps.map((step, index) => {
          const isActive = !finishedAll && index === safeActive;
          const isCompleted =
            index < safeActive || (finishedAll && index === safeActive);

          return (
            <li key={step.id} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-3 text-xs font-bold transition ${
                  isCompleted
                    ? "border-blue-100 bg-blue-600 text-white shadow-md shadow-blue-200 dark:border-blue-900 dark:shadow-blue-900/50"
                    : isActive
                      ? "border-blue-100 bg-blue-600 text-white shadow-md shadow-blue-200 dark:border-blue-900 dark:shadow-blue-900/50"
                      : "border-slate-200 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex flex-col gap-0">
                <span
                  className={`text-xs font-semibold ${isActive || isCompleted ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {step.label}
                </span>
                {step.helper ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {step.helper}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop view - horizontal with connecting line */}
      <div className="hidden sm:block">
        <ol className="relative flex items-start justify-between gap-2">
          {/* Connecting line behind circles - spans from center of first circle to center of last circle */}
          <div className="absolute left-[calc(50%_-_calc(100%/3)_-_20px)] right-[calc(50%_-_calc(100%/3)_-_20px)] top-[18px] h-[2px] bg-slate-300 dark:bg-slate-600" />

          {steps.map((step, index) => {
            const isActive = !finishedAll && index === safeActive;
            const isCompleted =
              index < safeActive || (finishedAll && index === safeActive);

            return (
              <li
                key={step.id}
                className="relative z-20 flex flex-1 flex-col items-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-3 text-sm font-bold shadow-lg transition ${
                    isCompleted
                      ? "border-blue-100 bg-blue-600 text-white shadow-blue-200"
                      : isActive
                        ? "border-blue-100 bg-blue-600 text-white shadow-blue-200"
                        : "border-slate-200 bg-white text-slate-500 shadow-slate-100"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-3 flex flex-col items-center gap-0.5 text-center">
                  <span
                    className={`text-xs font-semibold ${isActive || isCompleted ? "text-slate-900" : "text-slate-500"}`}
                  >
                    {step.label}
                  </span>
                  {step.helper ? (
                    <span className="text-xs text-slate-500">
                      {step.helper}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
