import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ApiError = { error?: { code?: string; message?: string } };

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "error" in error;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback;
  if (error instanceof Error) return error.message;
  if (isApiError(error)) return error.error?.message ?? fallback;
  return fallback;
}

type RelativeTimeOptions = {
  numeric?: "always" | "auto";
  locale?: string;
};

export function formatRelative(
  dateString?: string,
  options?: RelativeTimeOptions
): string | undefined {
  if (!dateString) return undefined;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return undefined;

  const diffMs = date.getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  const formatter = new Intl.RelativeTimeFormat(options?.locale ?? "pt-BR", {
    numeric: options?.numeric ?? "always",
  });

  if (Math.abs(diffMins) < 60) return formatter.format(diffMins, "minute");
  const diffHours = Math.round(diffMins / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return formatter.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return formatter.format(diffMonths, "month");

  const diffYears = Math.round(diffMonths / 12);
  return formatter.format(diffYears, "year");
}
