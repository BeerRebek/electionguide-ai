import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

/**
 * next-intl request configuration (non-routing mode).
 *
 * In this setup, locale is determined by:
 * 1. Cookie "NEXT_LOCALE" (set by LanguageSwitcher or onboarding)
 * 2. Accept-Language header
 * 3. Default: "en"
 *
 * This avoids the /[locale]/ URL prefix — locale is a user preference,
 * not a URL segment, which matches the onboarding-based language selection.
 */

const SUPPORTED_LOCALES = [
  "en", "hi", "bn", "te", "mr", "ta",
  "gu", "kn", "ml", "pa", "as", "or",
  "ur", "ne", "sa",
] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupported(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Check cookie
  let locale: string = cookieStore.get("NEXT_LOCALE")?.value || "";

  // 2. Fallback to Accept-Language
  if (!locale || !isSupported(locale)) {
    const acceptLang = headerStore.get("accept-language") || "";
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().split("-")[0])
      .find((l) => isSupported(l));
    locale = preferred || "en";
  }

  // 3. Ensure valid
  if (!isSupported(locale)) locale = "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
