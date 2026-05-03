"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { OnboardingLayout } from "@/components/features/onboarding/OnboardingLayout";
import { LanguageSelectionStep } from "@/components/features/onboarding/LanguageSelectionStep";
import { LocationStep } from "@/components/features/onboarding/LocationStep";
import { VoterProfileStep } from "@/components/features/onboarding/VoterProfileStep";
import { NotificationsStep } from "@/components/features/onboarding/NotificationsStep";
import { VoterIdVerificationStep } from "@/components/features/onboarding/VoterIdVerificationStep";

export default function OnboardingPage() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const router = useRouter();

  // Guard: redirect if onboarding already completed (step 5 = done)
  useEffect(() => {
    if (currentStep >= 6) {
      router.replace("/");
    }
  }, [currentStep, router]);

  // Don't render anything while redirecting
  if (currentStep >= 6) {
    return null;
  }

  return (
    <OnboardingLayout>
      {currentStep === 1 && <LanguageSelectionStep />}
      {currentStep === 2 && <LocationStep />}
      {currentStep === 3 && <VoterProfileStep />}
      {currentStep === 4 && <NotificationsStep />}
      {currentStep === 5 && <VoterIdVerificationStep />}
    </OnboardingLayout>
  );
}
