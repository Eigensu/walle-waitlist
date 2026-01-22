"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { RegistrationForm } from "@/components/registration-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Theme Toggle Button */}
      <div className="absolute right-4 top-4 z-50 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-blue-200 blur-3xl dark:bg-blue-900/40" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-10 translate-y-10 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-900/40" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-300/60 ring-4 ring-blue-100 dark:from-blue-700 dark:to-indigo-700 dark:shadow-none dark:ring-blue-900/40">
            <Image
              src="/walle-logo.png"
              alt="Walle Arena"
              width={48}
              height={48}
              className="relative z-10 object-contain brightness-0 invert"
              priority
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Player Registration
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Complete your registration to join the Walle Premier League 2026
            </p>
          </div>
        </header>

        <Card className="border border-slate-200 bg-white/95 shadow-2xl shadow-blue-100/60 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-none">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <RegistrationForm />
            <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
              By registering, you agree to our{" "}
              <a
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                href="#"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                href="#"
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
