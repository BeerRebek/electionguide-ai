"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface OnboardingNavigationProps {
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function OnboardingNavigation({
  onNext,
  nextLabel,
  nextDisabled = false,
}: OnboardingNavigationProps) {
  const t = useTranslations("onboarding");
  const { currentStep, prevStep, nextStep } = useOnboardingStore();
  const router = useRouter();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;

  function handleBack() {
    if (isFirstStep) {
      router.push("/");
    } else {
      prevStep();
    }
  }

  function handleNext() {
    if (onNext) {
      onNext();
    } else if (isLastStep) {
      // Complete onboarding
      router.push("/dashboard");
    } else {
      nextStep();
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      aria-label={t("navigationAria")}
    >
      <div className="max-w-2xl mx-auto flex justify-between items-center w-full">
        {/* Back button — matches Stitch step-4 outline style */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center gap-1 text-primary text-[14px] leading-[1.4] tracking-[0.01em] font-medium h-[48px] px-4 rounded-lg border border-primary bg-transparent hover:bg-surface-container-low transition-colors active:scale-[0.98]"
          aria-label={isFirstStep ? t("homeAria") : t("backAria")}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          {t("back")}
        </button>

        {/* Next / Complete button — matches Stitch primary filled style */}
        <button
          onClick={handleNext}
          disabled={nextDisabled}
          className="flex items-center justify-center bg-primary text-on-primary text-[14px] leading-[1.4] tracking-[0.01em] font-medium h-[48px] px-6 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLastStep ? t("completeAria") : t("nextAria")}
        >
          {nextLabel || (isLastStep ? t("completeSetup") : t("next"))}
          {!isLastStep && (
            <span className="material-symbols-outlined text-[20px] ml-1">arrow_forward</span>
          )}
        </button>
      </div>
    </nav>
  );
}
