"use client";

import { useMemo, useRef, useId, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";

export type FileUploadProps = {
  label: string;
  description?: string;
  accept?: string;
  maxBytes?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  hint?: string;
};

export function FileUpload({
  label,
  description,
  accept,
  maxBytes = 10 * 1024 * 1024,
  value,
  onChange,
  error,
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  const prettySize = useMemo(() => {
    if (!value) return null;
    const mb = value.size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <FormLabel htmlFor={inputId}>{label}</FormLabel>
        {hint ? (
          <span
            id={`${inputId}-hint`}
            className="text-xs text-muted-foreground"
          >
            {hint}
          </span>
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
        className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white/80 px-3 py-4 text-center shadow-[0_12px_36px_-24px_rgba(0,0,0,0.35)] transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:border-blue-500 dark:hover:bg-slate-700/50 dark:focus-visible:ring-blue-900/40 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-6"
      >
        {/* Hidden file input for mobile/desktop file selection */}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setLocalError(null);

            if (!file) {
              onChange(null);
              // Reset input to allow re-selecting the same file
              if (inputRef.current) {
                inputRef.current.value = "";
              }
              return;
            }

            const allowedTypes = accept
              ?.split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            if (file.size > maxBytes) {
              const mb = maxBytes / (1024 * 1024);
              setLocalError(
                `File is too large. Max ${mb.toFixed(0)}MB allowed.`,
              );
              onChange(null);
              // Reset input
              if (inputRef.current) {
                inputRef.current.value = "";
              }
              return;
            }

            if (
              allowedTypes &&
              allowedTypes.length > 0 &&
              !allowedTypes.includes(file.type)
            ) {
              setLocalError(
                `Unsupported file type (${file.type || "unknown"}). Allowed: ${allowedTypes.join(", ")}`,
              );
              onChange(null);
              // Reset input
              if (inputRef.current) {
                inputRef.current.value = "";
              }
              return;
            }

            onChange(file ?? null);
            // Reset input to allow re-selecting the same file
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          className="sr-only"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 sm:h-14 sm:w-14">
          <UploadCloud className="size-6 sm:size-7" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
            Drop your file here, or click to browse
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {description ?? "JPEG, PNG, HEIC/HEIF, or PDF (max 10MB)"}
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
          className="z-0 border-blue-200 bg-white text-blue-700 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600"
          onClick={() => inputRef.current?.click()}
        >
          Upload file
        </Button>
        {error ? (
          <FormMessage className="mt-1 text-sm">{error}</FormMessage>
        ) : localError ? (
          <p className="mt-1 text-sm text-destructive">{localError}</p>
        ) : null}
      </div>
    </div>
  );
}
