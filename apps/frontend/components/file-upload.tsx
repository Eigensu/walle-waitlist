"use client";

import { useMemo, useRef } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type FileUploadProps = {
  label: string;
  description?: string;
  accept?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  hint?: string;
};

export function FileUpload({
  label,
  description,
  accept,
  value,
  onChange,
  error,
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const prettySize = useMemo(() => {
    if (!value) return null;
    const mb = value.size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <FormLabel>{label}</FormLabel>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white/80 px-4 py-6 text-center shadow-[0_20px_60px_-35px_rgba(0,0,0,0.4)] transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:border-blue-500 dark:hover:bg-slate-700/50 dark:focus-visible:ring-blue-900/40"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <UploadCloud className="size-7" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drop your file here, or click to browse
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description ?? "JPEG, PNG, WebP, or PDF (max 5MB)"}
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {value?.name ? (
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {value.name} {prettySize ? `• ${prettySize}` : ""}
            </span>
          ) : (
            <span>No file selected</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-blue-200 bg-white text-blue-700 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600"
          onClick={() => inputRef.current?.click()}
        >
          Upload file
        </Button>
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            onChange(file ?? null);
          }}
        />
        {error ? (
          <FormMessage className="mt-1 text-sm">{error}</FormMessage>
        ) : null}
      </div>
    </div>
  );
}
