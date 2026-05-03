"use client";

import { useTranslations } from "next-intl";

export function ElectionJourney() {
  const t = useTranslations("dashboard.electionJourney");

  const JOURNEY_STEPS = [
    { label: t("steps.rollPrep.label"), date: t("steps.rollPrep.date"), status: "completed" as const },
    { label: t("steps.announcement.label"), date: t("steps.announcement.date"), status: "completed" as const },
    { label: t("steps.nominations.label"), date: t("steps.nominations.date"), status: "completed" as const },
    { label: t("steps.campaigning.label"), date: t("steps.campaigning.date"), status: "active" as const },
    { label: t("steps.polling.label"), date: t("steps.polling.date"), status: "upcoming" as const },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm h-full">
      <h3 className="text-2xl font-semibold text-on-surface mb-6 border-b border-surface-dim pb-2">
        {t("title")}
      </h3>
      <div className="relative pl-6 border-l-2 border-surface-container-highest space-y-8 mt-4">
        {JOURNEY_STEPS.map((step) => (
          <div key={step.label} className="relative">
            <div
              className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                step.status === "completed"
                  ? "bg-tertiary-container"
                  : step.status === "active"
                  ? "bg-secondary-container shadow-[0_0_0_4px_rgba(254,152,50,0.2)]"
                  : "bg-surface-container-highest"
              }`}
            />
            <h4
              className={`text-sm font-medium ${
                step.status === "active"
                  ? "text-secondary-container font-bold"
                  : step.status === "upcoming"
                  ? "text-outline"
                  : "text-on-surface"
              }`}
            >
              {step.label}
            </h4>
            <p
              className={`text-xs ${
                step.status === "upcoming"
                  ? "text-outline"
                  : "text-on-surface-variant"
              }`}
            >
              {step.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
