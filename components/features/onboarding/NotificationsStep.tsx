"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { syncOnboardingToProfile } from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

const NOTIFICATION_ITEM_KEYS = [
  "electionReminders",
  "voterGuides",
  "dailyQuiz",
  "localNews",
  "weeklyDigest",
] as const;

export function NotificationsStep() {
  const t = useTranslations("onboarding");
  const { notifications, setNotifications, complete } = useOnboardingStore();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  async function handleComplete() {
    setSyncing(true);
    setSyncError("");

    // Sync all onboarding data to Supabase
    const state = useOnboardingStore.getState();
    const { error } = await syncOnboardingToProfile(state);

    if (error) {
      // Non-blocking: still complete even if sync fails (data is in localStorage)
      console.warn("Profile sync failed, will retry on next login:", error);
      setSyncError(typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error));
    }

    // Clear the middleware's onboarded cookie so it re-checks from DB
    document.cookie = "onboarded=true; path=/; max-age=3600; samesite=lax";

    complete();
    router.push("/dashboard");
  }

  async function handleAllowPush() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifications({ pushEnabled: permission === "granted" });
    }
  }

  return (
    <>
      {/* Header — matches Stitch notification_preferences */}
      <section className="flex flex-col gap-2 mb-10 text-center sm:text-left">
        <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-primary">
          {t("stayInformed")}
        </h1>
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl">
          {t("notificationsPrivacy")}
        </p>
      </section>

      {/* Push Notification Banner — matches Stitch CTA card */}
      <section className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-start sm:items-center gap-4 flex-col sm:flex-row shadow-sm mb-10">
        <div className="p-2 bg-primary-container rounded-full text-primary flex-shrink-0">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            notifications_active
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] leading-[1.4] tracking-[0.01em] font-bold text-on-surface mb-1">
            {t("realTimeAlerts")}
          </h3>
          <p className="text-[12px] leading-[1.4] text-on-surface-variant">
            {t("enablePush")}
          </p>
        </div>
        <button
          onClick={handleAllowPush}
          className={`text-[14px] leading-[1.4] tracking-[0.01em] font-bold h-[40px] px-6 rounded-full whitespace-nowrap transition-all shadow-sm active:scale-95 ${
            notifications.pushEnabled
              ? "bg-secondary text-on-secondary"
              : "bg-primary text-on-primary hover:bg-primary/90"
          }`}
        >
          {notifications.pushEnabled ? `✓ ${t("pushEnabled")}` : t("allowNotifications")}
        </button>
      </section>

      {/* Preferences List — matches Stitch toggle list card */}
      <section className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant">
          {NOTIFICATION_ITEM_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between p-6 hover:bg-surface-container-lowest transition-colors"
            >
              <div className="pr-4">
                <label
                  className="text-[14px] leading-[1.4] tracking-[0.01em] font-bold text-on-surface block mb-1 cursor-pointer"
                  htmlFor={`toggle-${key}`}
                >
                  {t(`notificationItems.${key}.label`)}
                </label>
                <span className="text-[12px] leading-[1.4] text-on-surface-variant block">
                  {t(`notificationItems.${key}.description`)}
                </span>
              </div>
              {/* Toggle Switch — custom CSS matching Stitch */}
              <button
                id={`toggle-${key}`}
                role="switch"
                aria-checked={notifications[key]}
                onClick={() =>
                  setNotifications({ [key]: !notifications[key] })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  notifications[key]
                    ? "bg-primary"
                    : "bg-outline"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                    notifications[key]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {syncError && (
        <p className="mt-4 text-error text-sm font-medium text-center">{syncError}</p>
      )}

      <OnboardingNavigation
        onNext={handleComplete}
        nextLabel={t("completeSetup")}
        nextDisabled={syncing}
      />
    </>
  );
}
