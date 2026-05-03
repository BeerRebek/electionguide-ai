"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "./OnboardingProgress";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { syncOnboardingToProfile } from "@/lib/supabase/actions";

import { useTranslations } from "next-intl";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const t = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const { currentStep, skipStep, complete } = useOnboardingStore();
  const router = useRouter();
  const [skipping, setSkipping] = useState(false);

  async function handleSkip() {
    if (currentStep >= 4) {
      // On last step, complete and sync to DB
      setSkipping(true);
      const state = useOnboardingStore.getState();
      await syncOnboardingToProfile(state);
      document.cookie = "onboarded=true; path=/; max-age=3600; samesite=lax";
      complete();
      router.push("/dashboard");
    } else {
      skipStep();
    }
  }

  async function handleSkipAll() {
    setSkipping(true);
    const state = useOnboardingStore.getState();
    await syncOnboardingToProfile(state);
    document.cookie = "onboarded=true; path=/; max-age=3600; samesite=lax";
    complete();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased">
      {/* Header — matches Stitch step-4 header style */}
      <header className="w-full px-6 py-4 max-w-[1200px] mx-auto flex flex-col gap-2 mt-4">
        <div className="flex justify-between items-end mb-2">
          <a
            href="/"
            className="text-[24px] leading-[1.4] font-semibold text-primary flex items-center gap-2"
            aria-label="ElectionGuide AI Home"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              how_to_vote
            </span>
            ElectionGuide AI
          </a>
          <div className="flex items-center gap-2">
            {currentStep < 4 && (
              <button
                onClick={handleSkipAll}
                disabled={skipping}
                className="text-slate-400 hover:text-slate-600 transition-colors px-3 py-2 rounded-lg text-xs font-medium"
                aria-label={t("skipAllAria")}
              >
                {t("skipAll")}
              </button>
            )}
            <button
              onClick={handleSkip}
              disabled={skipping}
              className="text-slate-500 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-1 group text-sm font-medium"
              aria-label={t("skipStepAria")}
            >
              {skipping ? t("saving") : tCommon("skip")}
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward_ios
              </span>
            </button>
          </div>
        </div>
        <OnboardingProgress />
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-32 flex flex-col">
        {children}
      </main>
    </div>
  );
}
