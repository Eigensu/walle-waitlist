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
        "flex items-center justify-between gap-6 px-5 py-4",
        "rounded-lg border border-blue-400/60 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900",
        "dark:border-blue-700/50",
        className,
      )}
    >
      {/* Title Sponsor */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Title Sponsor
          </p>
          <Image
            src="/BVC%20Logo-02.png"
            alt="BVC Logo - Title Sponsor"
            width={160}
            height={45}
            className="h-10 w-auto object-contain brightness-110"
            priority
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-12 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />

      {/* Powered By */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Powered By
          </p>
          <Image
            src="/Powered%20By%20-%20Copy.png"
            alt="Powered By"
            width={120}
            height={28}
            className="h-7 w-auto object-contain brightness-110"
            priority
          />
        </div>
      </div>
    </div>
  );
}
