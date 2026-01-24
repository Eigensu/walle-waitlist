"use client";

import { Separator } from "@/components/ui/separator";

type RulesNoticeProps = {
  className?: string;
};

export function RulesNotice({ className }: RulesNoticeProps) {
  const headingId = "rules-heading";

  return (
    <section
      role="region"
      aria-labelledby={headingId}
      className={[
        "rounded-lg bg-red-50/70 p-3 sm:p-5",
        "ring-1 ring-red-200 dark:bg-red-900/15 dark:ring-red-800/60",
        className ?? "",
      ].join(" ")}
    >
      <h2
        id={headingId}
        className="mb-3 text-base font-bold tracking-wide text-red-700 dark:text-red-400"
      >
        Important Registration Rules
      </h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-red-700 dark:text-red-300 sm:text-base">
        <li>
          <span className="italic font-semibold">
            Registration does not confirm participation.
          </span>{" "}
          Limited player slots available.
        </li>
        <li>
          Player registration fee is{" "}
          <span className="italic font-semibold">Rs.12,500/-</span>. Payment
          will be collected online only.
        </li>
        <li>
          Only owners, partners, directors (no top management) of jewellers or
          allied industry are allowed to participate.
        </li>
        <li>Decisions taken by management will be final and binding.</li>
        <li>Any discrepancies found in form registration will be cancelled.</li>
        <li>
          Only{" "}
          <span className="italic font-semibold">one entry per player</span>.
        </li>
        <li>
          Players are requested to participate only if they are available for
          practise sessions and during tournament dates i.e. 6-7-8-9 March 2025.
        </li>
      </ol>

      <Separator className="my-4 opacity-50" />

      <div className="space-y-1 text-center text-sm sm:text-base">
        <p className="font-bold tracking-wide text-red-700 dark:text-red-400">
          Tournament Schedule:
        </p>
        <p className="font-semibold italic text-red-700 dark:text-red-300">
          4 February Player's Screening (Mumbai)
        </p>
        <p className="font-semibold italic text-red-700 dark:text-red-300">
          15-16 February Player's Auction and Launch Party (Khamshet)
        </p>
        <p className="font-semibold italic text-red-700 dark:text-red-300">
          6-7-8-9 March Tournament (Mumbai)
        </p>
      </div>
    </section>
  );
}
