import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100/20 to-indigo-100/30 font-sans text-foreground">
      <main className="flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:px-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/walle-logo.png"
              alt="Walle Arena Logo"
              width={120}
              height={120}
              className="drop-shadow-lg"
              priority
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-5xl">
                WALLE ARENA
              </h1>
              <p className="text-lg font-medium text-blue-700">
                Player Registration Portal
              </p>
            </div>
          </div>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-blue-200 bg-white p-10 shadow-2xl">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-12 translate-x-12 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 translate-y-12 -translate-x-12 rounded-full bg-indigo-500/5 blur-3xl"></div>

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-100 px-4 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-900">
                  Registration Open
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight text-blue-900 sm:text-5xl">
                Join the Arena
              </h2>
              <p className="max-w-2xl text-xl leading-relaxed text-blue-700">
                Complete your registration in two simple steps. Submit your
                profile, upload required documents, and secure your spot with
                instant payment confirmation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Submit Details</p>
                  <p className="text-sm text-blue-600">Profile & documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Secure Payment</p>
                  <p className="text-sm text-blue-600">Via Razorpay</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Get Confirmed</p>
                  <p className="text-sm text-blue-600">Instant verification</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                href="/register"
              >
                <span>Begin Registration</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <div className="flex items-center gap-2 text-sm text-blue-700">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  Takes approximately 3 minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
