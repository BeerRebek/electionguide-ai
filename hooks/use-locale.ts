"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setLocaleCookie } from "@/lib/supabase/actions";

const SUPPORTED_LOCALES = [
  "en", "hi", "bn", "te", "mr", "ta",
  "gu", "kn", "ml", "pa", "as", "or",
  "ur", "ne", "sa",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<SupportedLocale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  hi: { native: "हिन्दी", english: "Hindi" },
  bn: { native: "বাংলা", english: "Bengali" },
  te: { native: "తెలుగు", english: "Telugu" },
  mr: { native: "मराठी", english: "Marathi" },
  ta: { native: "தமிழ்", english: "Tamil" },
  gu: { native: "ગુજરાતી", english: "Gujarati" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada" },
  ml: { native: "മലയാളം", english: "Malayalam" },
  pa: { native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  as: { native: "অসমীয়া", english: "Assamese" },
  or: { native: "ଓଡ଼ିଆ", english: "Odia" },
  ur: { native: "اردو", english: "Urdu" },
  ne: { native: "नेपाली", english: "Nepali" },
  sa: { native: "संस्कृतम्", english: "Sanskrit" },
};

/**
 * Returns current locale and a function to change it.
 * Updates cookie, refreshes page to load new translations.
 */
export function useLocale() {
  const router = useRouter();

  const locale = (typeof document !== "undefined"
    ? document.cookie
        .split("; ")
        .find((c) => c.startsWith("NEXT_LOCALE="))
        ?.split("=")[1]
    : "en") as SupportedLocale || "en";

  const changeLocale = useCallback(
    async (newLocale: SupportedLocale) => {
      if (!SUPPORTED_LOCALES.includes(newLocale)) return;

      await setLocaleCookie(newLocale);
      router.refresh();
    },
    [router]
  );

  const isRTL = locale === "ur";

  return {
    locale,
    changeLocale,
    isRTL,
    locales: SUPPORTED_LOCALES,
    localeNames: LOCALE_NAMES,
  };
}
