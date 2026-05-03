"use client";

import { useTranslations } from "next-intl";

export function FeatureGrid() {
  const t = useTranslations("features");

  const features = [
    {
      icon: "chat",
      title: t("chatbot_title"),
      description: t("chatbot_desc"),
      accent: "primary-container",
      borderTop: false,
    },
    {
      icon: "history",
      title: t("timeline_title"),
      description: t("timeline_desc"),
      accent: "secondary-container",
      borderTop: true,
    },
    {
      icon: "menu_book",
      title: t("guides_title"),
      description: t("guides_desc"),
      accent: "tertiary-container",
      borderTop: false,
    },
  ];

  return (
    <section
      className="max-w-[1200px] mx-auto px-6 md:px-12 w-full py-8"
      aria-labelledby="features-heading"
    >
      <h2
        id="features-heading"
        className="text-[32px] leading-[1.3] font-semibold tracking-[-0.01em] text-on-background mb-8 text-center"
      >
        {t("heading")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`bg-surface-container-lowest rounded-xl p-6 border border-outline-variant hover:shadow-sm transition-shadow group flex flex-col items-start gap-4 ${
              feature.borderTop
                ? "border-t-4 border-t-secondary-container"
                : ""
            }`}
          >
            {/* Icon */}
            <div
              className={`p-3 bg-surface-container rounded-lg text-${feature.accent} group-hover:bg-${feature.accent} group-hover:text-on-primary transition-colors`}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                {feature.icon}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl leading-[1.4] font-semibold text-on-background">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-base leading-[1.6] text-on-surface-variant flex-grow">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

