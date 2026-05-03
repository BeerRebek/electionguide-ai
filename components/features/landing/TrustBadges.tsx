"use client";

import { useTranslations } from "next-intl";

export function TrustBadges() {
  const t = useTranslations("trust");

  const badges = [
    {
      icon: "verified_user",
      color: "text-tertiary-container",
      text: t("eci"),
    },
    {
      icon: "accessibility_new",
      color: "text-primary-container",
      text: t("gigw"),
    },
    {
      icon: "visibility",
      color: "text-secondary-container",
      text: t("wcag"),
    },
  ];

  return (
    <section
      className="border-y border-outline-variant bg-surface-container-low/50 py-6"
      aria-label="Trust and compliance badges"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-wrap justify-center md:justify-between items-center gap-8 text-on-surface-variant">
        {badges.map((badge) => (
          <div
            key={badge.icon}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <span
              className={`material-symbols-outlined ${badge.color}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              {badge.icon}
            </span>
            {badge.text}
          </div>
        ))}
      </div>
    </section>
  );
}

