"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useTranslations } from "next-intl";

const TOTAL_STEPS = 5;

export function OnboardingProgress() {
  const t = useTranslations("onboarding");
  const currentStep = useOnboardingStore((s) => s.currentStep);

  return (
    <div 
      className="w-full mb-10" 
      role="progressbar" 
      aria-valuenow={currentStep} 
      aria-valuemin={1} 
      aria-valuemax={TOTAL_STEPS} 
      aria-label={t("progressStep", { current: currentStep, total: TOTAL_STEPS })}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface-variant">
          {t("progressStep", { current: currentStep, total: TOTAL_STEPS })}
        </span>
        <span className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold text-primary">
          {t(`step${currentStep}Label`)}
        </span>
      </div>
      {/* Segmented progress bar (Step 4 style from Stitch) */}
      <div className="flex w-full gap-2 h-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-500 ease-out ${
              i < currentStep ? "bg-on-tertiary-container" : "bg-surface-variant"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
