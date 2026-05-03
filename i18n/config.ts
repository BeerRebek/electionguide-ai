/**
 * ElectionGuide AI — i18n Configuration
 * Central source of truth for all locale settings.
 */

export const locales = [
  "en", "hi", "bn", "te", "mr", "ta",
  "gu", "kn", "ml", "pa", "as", "or",
  "ur", "ne", "sa",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Locale metadata: native script name and English name.
 */
export const localeNames: Record<Locale, { native: string; english: string }> = {
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

/** Locales that use right-to-left text direction */
export const rtlLocales: Locale[] = ["ur"];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
