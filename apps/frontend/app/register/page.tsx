"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { RegistrationForm } from "@/components/registration-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { SponsorStrip } from "@/components/sponsor-strip";
import { getPublicConfig } from "@/lib/api";

export default function RegisterPage() {
  const [regOpen, setRegOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await getPublicConfig();
        setRegOpen(cfg.registration_open);
      } catch (e) {
        // If config fails, default to showing the form to avoid blocking
        setRegOpen(true);
      }
    };
    loadConfig();
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Theme Toggle Button */}
      <div className="absolute right-4 top-4 z-50 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {/* Ambient blobs */}
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-900/40" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-10 translate-y-10 rounded-full bg-indigo-200/60 blur-3xl dark:bg-indigo-900/40" />
        {/* Cricket players background */}
        <Image
          src="/cricket-bg.svg"
          alt="Cricket players background"
          fill
          priority
          className="object-cover opacity-10 dark:opacity-15"
        />
        {/* diagonal sporty overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.08)_0%,rgba(99,102,241,0.08)_50%,transparent_50%)]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 sm:py-8 sm:px-8 lg:px-10">
        <header className="relative mb-3 overflow-hidden rounded-2xl border-2 border-blue-400/60 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 sm:p-8 shadow-lg dark:border-blue-700/50 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950">
          {/* Subtle cricket stitches pattern */}
          <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 opacity-[0.07] sm:h-20 sm:w-20">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white" />
            <div className="absolute left-1/4 top-0 h-full w-px bg-white" />
            <div className="absolute right-1/4 top-0 h-full w-px bg-white" />
          </div>

          <div className="relative flex flex-col items-center gap-2 text-center sm:gap-3">
            {/* Compact logo */}
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl ring-2 ring-yellow-400/40 sm:h-16 sm:w-16">
              <Image
                src="/walle-logo.png"
                alt="Walle Arena"
                width={56}
                height={56}
                className="relative z-10 h-10 w-10 object-contain sm:h-12 sm:w-12"
                priority
              />
            </div>

            {/* Compact title section */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-2xl">
                Player Registration Portal
              </h1>
              <p className="text-[11px] font-medium text-blue-100 sm:text-xs">
                Walle Arena
              </p>
            </div>

            {/* Registration Status Pill */}
            {regOpen !== null && (
              <div
                className={
                  `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] shadow-sm ` +
                  (regOpen
                    ? "bg-green-100/90 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-red-100/90 text-red-800 dark:bg-red-900/50 dark:text-red-300")
                }
              >
                <div
                  className={
                    `h-1.5 w-1.5 animate-pulse rounded-full ` +
                    (regOpen ? "bg-green-600" : "bg-red-600")
                  }
                ></div>
                {regOpen ? "Registration Open" : "Registration Closed"}
              </div>
            )}
          </div>

          {/* Vibrant bottom stripe */}
          <div className="absolute bottom-0 left-0 right-0 flex h-1">
            <div className="h-full w-1/3 bg-gradient-to-r from-yellow-400 to-green-400" />
            <div className="h-full w-1/3 bg-green-400" />
            <div className="h-full w-1/3 bg-gradient-to-r from-green-400 to-yellow-400" />
          </div>
        </header>

        {/* Sponsor strip now outside header */}
        <div className="mb-3">
          <SponsorStrip />
        </div>

        <Card className="border-2 border-blue-200 bg-white/95 shadow-2xl shadow-blue-100/60 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-none">
          <CardContent className="p-6 sm:p-8 space-y-3">
            {regOpen === false ? (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center text-slate-800 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-200">
                <p className="text-lg font-semibold">
                  Registration is currently closed
                </p>
                <p className="mt-1 text-sm">
                  Please check back later or contact the organizers for updates.
                </p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="text-center text-sm text-slate-500">
                    Loading registration form…
                  </div>
                }
              >
                <RegistrationFormWrapper />
              </Suspense>
            )}
            <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
              By registering, you agree to our{" "}
              <a
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                href="/terms-of-service"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RegistrationFormWrapper() {
  const searchParams = useSearchParams();
  const resumePlayerId = searchParams.get("resume");
  return <RegistrationForm resumePlayerId={resumePlayerId} />;
}
