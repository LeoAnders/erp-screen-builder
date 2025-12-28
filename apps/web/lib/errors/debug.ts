"use client";

export const shouldShowTechnicalDetails = () => {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NEXT_PUBLIC_ERROR_DEBUG === "true";
};
