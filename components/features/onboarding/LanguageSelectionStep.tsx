"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { SUPPORTED_LANGUAGES } from "@/lib/data/india";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { useTranslations } from "next-intl";

export function LanguageSelectionStep() {
  const { language, setLanguage, nextStep } = useOnboardingStore();
  const t = useTranslations("onboarding");

  return (
    <>
      {/* Header — matches Stitch language_selection header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface mb-2">
          {t("step1Title")}{" "}
          <br className="hidden sm:block" />
          <span className="text-primary opacity-90 mt-2 block sm:inline">
            {t("step1TitleSecondary")}
          </span>
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant">
          {t("step1Subtitle")}
        </p>
      </div>

      {/* Language Grid — matches Stitch 2-col/3-col/4-col responsive grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              aria-pressed={isSelected}
              aria-label={t("selectLanguageAria", { language: lang.label })}
              className={`group relative rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[140px] overflow-hidden ${
                isSelected
                  ? "bg-surface-container-highest border-2 border-primary shadow-[0_4px_20px_-4px_rgba(0,35,111,0.1)]"
                  : "bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:shadow-[0_8px_30px_-12px_rgba(0,35,111,0.15)]"
              }`}
            >
              {/* Check icon for selected state */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                </div>
              )}

              {/* Native script label */}
              <span
                className={`text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold mb-2 transition-colors ${
                  isSelected
                    ? "text-primary"
                    : "text-on-surface group-hover:text-primary"
                }`}
                dir={("dir" in lang && lang.dir === "rtl") ? "rtl" : undefined}
              >
                {lang.native}
              </span>

              {/* English label */}
              <span
                className={`text-[14px] leading-[1.4] tracking-[0.01em] font-medium ${
                  isSelected ? "text-primary-container" : "text-on-surface-variant"
                }`}
              >
                {lang.label}
              </span>
            </button>
          );
        })}
      </div>

      <OnboardingNavigation onNext={nextStep} />
    </>
  );
}
