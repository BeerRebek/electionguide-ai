"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { INDIAN_STATES } from "@/lib/data/india";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export function LocationStep() {
  const { location, setLocation, nextStep } = useOnboardingStore();
  const t = useTranslations("onboarding");

  // Derive districts from selected state using constituency seed data mapping
  const districts = useMemo(() => {
    if (!location.state) return [];
    // Map state to known districts from seed data
    const districtMap: Record<string, string[]> = {
      "Andhra Pradesh": ["Srikakulam", "Vizianagaram", "Visakhapatnam", "Anakapalli"],
      "Assam": ["Karimganj", "Cachar", "Dhubri", "Kamrup"],
      "Bihar": ["Patna", "Madhubani", "Darbhanga"],
      "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "East Delhi"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
      "Haryana": ["Gurugram", "Faridabad"],
      "Karnataka": ["Bangalore", "Mysore"],
      "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode"],
      "Madhya Pradesh": ["Bhopal", "Indore"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
      "Punjab": ["Amritsar", "Ludhiana", "Chandigarh"],
      "Rajasthan": ["Jaipur", "Jodhpur"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      "Telangana": ["Hyderabad"],
      "Uttar Pradesh": ["Lucknow", "Varanasi", "Prayagraj", "Kanpur", "Gautam Buddha Nagar"],
      "West Bengal": ["Kolkata", "Howrah"],
    };
    return districtMap[location.state] || [];
  }, [location.state]);

  function handleUseLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In production, reverse-geocode to get state/district
          setLocation({ state: "Maharashtra", district: "Pune" });
        },
        () => {
          alert("Location permission denied. Please select manually.");
        }
      );
    }
  }

  return (
    <>
      {/* Header — matches Stitch location_setup */}
      <div className="text-center mb-10 max-w-lg w-full mx-auto">
        <h1 className="text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold text-on-surface mb-3">
          {t("whereVote")}
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant">
          {t("personalizeInfo")}
        </p>
      </div>

      {/* Form Card — matches Stitch surface-container-lowest card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 w-full max-w-lg mx-auto shadow-sm">
        {/* Use Location Button — matches Stitch outline button with icon */}
        <button
          onClick={handleUseLocation}
          className="w-full mb-8 h-[48px] rounded-lg border border-primary text-primary flex items-center justify-center gap-2 text-[14px] leading-[1.4] tracking-[0.01em] font-medium hover:bg-surface-container-low transition-colors active:scale-[0.98]"
          type="button"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            my_location
          </span>
          {t("useLocation")}
        </button>

        {/* Divider — matches Stitch "OR ENTER MANUALLY" */}
        <div className="flex items-center mb-8">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="px-4 text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface-variant">
            {t("enterManually")}
          </span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          {/* State Dropdown — matches Stitch select styling */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface"
              htmlFor="onb-state"
            >
              {t("stateLabel")}
            </label>
            <div className="relative">
              <select
                id="onb-state"
                value={location.state}
                onChange={(e) =>
                  setLocation({ state: e.target.value, district: "", constituency: "" })
                }
                className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors cursor-pointer hover:border-outline"
              >
                <option disabled value="">
                  {t("statePlaceholder")}
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* District Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface"
              htmlFor="onb-district"
            >
              {t("districtLabel")}
            </label>
            <div className="relative">
              <select
                id="onb-district"
                value={location.district}
                onChange={(e) =>
                  setLocation({ district: e.target.value, constituency: "" })
                }
                disabled={!location.state}
                className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors cursor-pointer hover:border-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option disabled value="">
                  {t("districtPlaceholder")}
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Constituency Dropdown */}
          <div className="flex flex-col gap-1.5 mb-2">
            <label
              className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface"
              htmlFor="onb-constituency"
            >
              {t("constituencyLabel")}
            </label>
            <div className="relative">
              <select
                id="onb-constituency"
                value={location.constituency}
                onChange={(e) => setLocation({ constituency: e.target.value })}
                disabled={!location.district}
                className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors cursor-pointer hover:border-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option disabled value="">
                  {t("constituencyPlaceholder")}
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Alternative PIN divider — matches Stitch */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="px-4 text-[12px] leading-[1.4] text-outline">
              {t("alternative")}
            </span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {/* PIN Code Input — matches Stitch input styling */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface"
              htmlFor="onb-pincode"
            >
              {t("pincodeLabel")}
            </label>
            <input
              id="onb-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder={t("pincodePlaceholder")}
              value={location.pinCode}
              onChange={(e) => setLocation({ pinCode: e.target.value.replace(/\D/g, "") })}
              className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
            />
          </div>
        </form>

        {/* Privacy note — matches Stitch lock icon banner */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[12px] leading-[1.4] text-on-surface-variant bg-surface-container-low py-3 px-4 rounded-lg">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            lock
          </span>
          {t("locationPrivacy")}
        </div>
      </div>

      <OnboardingNavigation onNext={nextStep} />
    </>
  );
}
