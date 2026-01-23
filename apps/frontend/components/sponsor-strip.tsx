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
        "grid grid-cols-1 gap-4 sm:grid-cols-2",
        "rounded-2xl border-2 border-blue-200 bg-white/70 p-4 backdrop-blur",
        "dark:border-blue-900/40 dark:bg-slate-800/70",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <span className="text-xs font-bold">TS</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-white">
            Title Sponsor
          </p>
          <div className="mt-1 flex items-center gap-3">
            <Image
              src="/title-sponsor.svg"
              alt="Title Sponsor"
              width={120}
              height={36}
              className="h-9 w-auto shrink-0 object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <span className="text-xs font-bold">PB</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-white">
            Powered By
          </p>
          <div className="mt-1 flex items-center gap-3">
            <Image
              src="/powered-by.svg"
              alt="Powered By"
              width={120}
              height={36}
              className="h-9 w-auto shrink-0 object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
