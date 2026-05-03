"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { useTranslations } from "next-intl";

const AGE_RANGES = ["18-25", "26-40", "41-60", "60+"];

const VOTER_STATUS_KEYS = ["first-time", "registered", "not-registered", "unsure"] as const;

const INTEREST_KEYS = [
  { value: "how-to-vote", icon: "how_to_vote" },
  { value: "candidate-info", icon: "person" },
  { value: "election-dates", icon: "calendar_month" },
  { value: "legal-procedures", icon: "gavel" },
  { value: "complaint-filing", icon: "report" },
] as const;

export function VoterProfileStep() {
  const t = useTranslations("onboarding");
  const { profile, setProfile, nextStep } = useOnboardingStore();

  function toggleInterest(interest: string) {
    const current = profile.interests;
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    setProfile({ interests: next });
  }

  return (
    <>
      {/* Header — matches Stitch voter_profile */}
      <div className="mb-10 text-center">
        <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-primary mb-4">
          {t("tellAboutYourself")}
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto">
          {t("profilePersonalization")}
        </p>
      </div>

      <div className="space-y-10 max-w-3xl mx-auto w-full">
        {/* Age Range — matches Stitch 2x4 grid with radio cards */}
        <section className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm transition-shadow hover:shadow-md">
          <h2 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-4">
            {t("ageRangeTitle")}
          </h2>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            role="radiogroup"
            aria-label={t("ageRangeAria")}
          >
            {AGE_RANGES.map((age) => (
              <label key={age} className="cursor-pointer">
                <input
                  type="radio"
                  name="age"
                  value={age}
                  checked={profile.ageRange === age}
                  onChange={() => setProfile({ ageRange: age })}
                  className="peer sr-only"
                />
                <div className="p-4 border rounded-lg border-outline-variant text-center bg-white peer-checked:border-primary peer-checked:bg-surface-container-highest peer-checked:text-primary transition-colors hover:bg-surface-container-low">
                  <span className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold">
                    {age}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Voter Status — matches Stitch 1x2 grid with radio + description */}
        <section className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm transition-shadow hover:shadow-md">
          <h2 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-4">
            {t("voterStatusTitle")}
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            role="radiogroup"
            aria-label={t("voterStatusAria")}
          >
            {VOTER_STATUS_KEYS.map((key) => (
              <label
                key={key}
                className={`cursor-pointer flex items-center p-4 border rounded-lg transition-colors hover:bg-surface-container-low ${
                  profile.voterStatus === key
                    ? "border-primary bg-surface-container-highest"
                    : "border-outline-variant bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="voter-status"
                  value={key}
                  checked={profile.voterStatus === key}
                  onChange={() => setProfile({ voterStatus: key })}
                  className="w-5 h-5 text-primary border-outline-variant focus:ring-primary mr-4 flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[14px] leading-[1.4] tracking-[0.01em] font-semibold text-on-surface">
                    {t(`voterStatuses.${key}.label`)}
                  </span>
                  <span className="text-[12px] leading-[1.4] text-on-surface-variant">
                    {t(`voterStatuses.${key}.description`)}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Interests — matches Stitch pill checkboxes with icons */}
        <section className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm transition-shadow hover:shadow-md">
          <h2 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-2">
            {t("interestsTitle")}
          </h2>
          <p className="text-[12px] leading-[1.4] text-on-surface-variant mb-4">
            {t("interestsSubtitle")}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("interestsAria")}>
            {INTEREST_KEYS.map((interest) => {
              const isSelected = profile.interests.includes(interest.value);
              return (
                <label key={interest.value} className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterest(interest.value)}
                    className="peer sr-only"
                  />
                  <div
                    className={`px-4 py-2 border rounded-full flex items-center gap-2 transition-all hover:bg-surface-container-low ${
                      isSelected
                        ? "bg-secondary-fixed border-secondary text-on-secondary-container"
                        : "border-outline-variant bg-white text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      {interest.icon}
                    </span>
                    <span className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium">
                      {t(`interests.${interest.value}`)}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      <OnboardingNavigation onNext={nextStep} />
    </>
  );
}
