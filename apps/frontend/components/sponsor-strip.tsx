"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function SponsorStrip({ className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 pt-4 pb-2",
        "rounded-lg border border-blue-400/60 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900",
        "dark:border-blue-700/50",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Image
            src="/JYPL%20Logo.png"
            alt="JYPL Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
        <div className="space-y-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
            Jewellers Youth Premier League
          </p>
          <p className="text-[11px] font-medium text-blue-100 sm:text-xs">
            Player Registration
          </p>
        </div>
      </div>

      {/* Title Sponsor */}
      <div className="flex w-full items-start justify-between gap-6 sm:gap-7">
        <div className="flex flex-col gap-0.5 min-w-0 ml-2 sm:ml-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-300 leading-none">
            Title Sponsor
          </p>
          <Image
            src="/BVC%20Logo-02.png"
            alt="BVC Logo - Title Sponsor"
            width={280}
            height={100}
            className="h-16 w-auto object-contain brightness-110 drop-shadow -my-0.5"
            priority
          />
        </div>

        {/* Divider */}
        <div className="h-14 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />

        {/* Powered By */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-300 leading-none">
            Powered By
          </p>
          <Image
            src="/Powered%20By%20-%20Copy.png"
            alt="Powered By"
            width={220}
            height={70}
            className="h-16 w-auto object-contain brightness-110 drop-shadow"
            priority
          />
        </div>
      </div>
    </div>
  );
}
