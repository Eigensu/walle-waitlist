"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { getPublicConfig, resumePayment } from "@/lib/api";

export default function Home() {
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const cfg = await getPublicConfig();
        setRegOpen(cfg.registration_open);
      } catch {
        // If fetch fails, leave as null to avoid misleading UI
        setRegOpen(null);
      }
    };
    load();
  }, []);

  const handleResumePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setResumeError(null);
    setResumeLoading(true);

    try {
      const result = await resumePayment(resumeEmail);
      // Navigate to register page with player ID to resume payment
      router.push(`/register?resume=${result.player_id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to find registration";
      setResumeError(message);
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100/20 to-indigo-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 font-sans text-foreground">
      <main className="flex w-full max-w-5xl lg:max-w-7xl flex-col gap-12 px-6 py-16 sm:px-12 lg:gap-16 lg:py-24">
        <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
          <div className="flex flex-col items-center gap-4 lg:gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 shadow-2xl lg:p-8">
              <Image
                src="/walle-logo.png"
                alt="Walle Arena Logo"
                width={100}
                height={100}
                className="h-24 w-24 lg:h-32 lg:w-32 object-contain brightness-0 invert"
                priority
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-5xl lg:text-6xl xl:text-7xl">
                WALLE ARENA
              </h1>
              <p className="text-lg font-medium text-blue-700 dark:text-blue-300 lg:text-xl xl:text-2xl">
                Player Registration Portal
              </p>
            </div>
          </div>
          <div className="h-px w-32 lg:w-48 bg-gradient-to-r from-transparent via-blue-400 dark:via-blue-500 to-transparent"></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-10 lg:p-12 xl:p-16 shadow-2xl">
          <div className="absolute right-0 top-0 h-64 w-64 lg:h-96 lg:w-96 -translate-y-12 translate-x-12 rounded-full bg-blue-500/5 dark:bg-blue-400/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 lg:h-96 lg:w-96 translate-y-12 -translate-x-12 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 blur-3xl"></div>

          <div className="relative flex flex-col gap-6 lg:gap-8">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div
                className={
                  `inline-flex items-center gap-2 self-start rounded-full px-4 py-2 lg:px-5 lg:py-2.5 ` +
                  (regOpen === false
                    ? "bg-red-100 dark:bg-red-900/40"
                    : "bg-blue-100 dark:bg-blue-900/40")
                }
              >
                <div
                  className={
                    `h-2 w-2 lg:h-2.5 lg:w-2.5 animate-pulse rounded-full ` +
                    (regOpen === false
                      ? "bg-red-600 dark:bg-red-400"
                      : "bg-blue-600 dark:bg-blue-400")
                  }
                ></div>
                <span
                  className={
                    `text-xs lg:text-sm font-semibold uppercase tracking-[0.15em] ` +
                    (regOpen === false
                      ? "text-red-900 dark:text-red-200"
                      : "text-blue-900 dark:text-blue-200")
                  }
                >
                  {regOpen === false
                    ? "Registration Closed"
                    : "Registration Open"}
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight text-blue-900 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Join the Arena
              </h2>
              <p className="max-w-2xl lg:max-w-3xl text-xl leading-relaxed text-blue-700 dark:text-slate-300 lg:text-2xl xl:text-3xl lg:leading-relaxed">
                Complete your registration in two simple steps. Submit your
                profile, upload required documents, and secure your spot with
                instant payment confirmation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
              <div className="flex items-start gap-3 lg:gap-4 rounded-xl border border-blue-200 dark:border-slate-600 bg-blue-50/50 dark:bg-slate-700/50 p-4 lg:p-6">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold lg:text-lg">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-white lg:text-lg">
                    Submit Details
                  </p>
                  <p className="text-sm lg:text-base text-blue-600 dark:text-blue-400">
                    Profile & documents
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 lg:gap-4 rounded-xl border border-blue-200 dark:border-slate-600 bg-blue-50/50 dark:bg-slate-700/50 p-4 lg:p-6">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold lg:text-lg">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-white lg:text-lg">
                    Secure Payment
                  </p>
                  <p className="text-sm lg:text-base text-blue-600 dark:text-blue-400">
                    Via Razorpay
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 lg:gap-4 rounded-xl border border-blue-200 dark:border-slate-600 bg-blue-50/50 dark:bg-slate-700/50 p-4 lg:p-6">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold lg:text-lg">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-white lg:text-lg">
                    Get Confirmed
                  </p>
                  <p className="text-sm lg:text-base text-blue-600 dark:text-blue-400">
                    Instant verification
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-6">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 lg:px-10 lg:py-5 text-base lg:text-lg xl:text-xl font-bold text-white shadow-lg shadow-blue-600/30 dark:shadow-none transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                href="/register"
              >
                <span>Begin Registration</span>
                <svg
                  className="h-5 w-5 lg:h-6 lg:w-6"
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
              <div className="flex items-center gap-2 text-sm lg:text-base xl:text-lg text-blue-700 dark:text-slate-300">
                <svg
                  className="h-5 w-5 lg:h-6 lg:w-6"
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

        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-8 lg:p-12 xl:p-16 shadow-xl">
          <div className="absolute right-0 top-0 h-48 w-48 lg:h-64 lg:w-64 -translate-y-8 translate-x-8 rounded-full bg-amber-400/10 blur-3xl"></div>

          <div className="relative flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white">
                <svg
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-900 dark:text-amber-100">
                  Resume Payment
                </h3>
                <p className="text-sm lg:text-base xl:text-lg text-amber-700 dark:text-amber-300">
                  Already registered? Complete your payment
                </p>
              </div>
            </div>

            <form
              onSubmit={handleResumePayment}
              className="flex flex-col gap-3 lg:gap-4"
            >
              <div className="flex flex-col gap-2 lg:gap-3">
                <label
                  htmlFor="resume-email"
                  className="text-sm lg:text-base font-medium text-amber-900 dark:text-amber-200"
                >
                  Enter your registered email
                </label>
                <input
                  id="resume-email"
                  type="email"
                  required
                  value={resumeEmail}
                  onChange={(e) => setResumeEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 px-4 py-3 lg:px-5 lg:py-4 lg:text-lg text-amber-900 dark:text-white placeholder:text-amber-400 dark:placeholder:text-amber-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {resumeError && (
                <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base text-red-700 dark:text-red-300">
                  {resumeError}
                </div>
              )}

              <button
                type="submit"
                disabled={resumeLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg xl:text-xl font-semibold text-white shadow-md hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition"
              >
                {resumeLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Payment</span>
                    <svg
                      className="h-5 w-5 lg:h-6 lg:w-6"
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
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
