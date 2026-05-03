"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      className="max-w-[1200px] mx-auto px-6 md:px-12 w-full pt-8 md:pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      aria-labelledby="hero-heading"
    >
      {/* Text Column */}
      <div className="flex flex-col gap-6">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full w-fit">
          <span
            className="material-symbols-outlined text-secondary-container text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            info
          </span>
          <span className="text-xs text-on-surface-variant">
            {t("badge")}
          </span>
        </div>

        {/* Heading */}
        <h1
          id="hero-heading"
          className="text-[40px] leading-[1.2] font-bold tracking-[-0.02em] text-on-background"
        >
          {t("title")}
        </h1>

        {/* Subheading */}
        <p className="text-lg leading-[1.6] text-on-surface-variant">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="/onboarding"
            className="min-h-[48px] px-6 bg-primary-container text-on-primary rounded-lg text-sm font-medium shadow-sm hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2"
          >
            {t("cta_primary")}
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              arrow_forward
            </span>
          </a>
          <a
            href="/chat"
            className="min-h-[48px] px-6 border border-primary-container text-primary-container bg-transparent rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              smart_toy
            </span>
            {t("cta_secondary")}
          </a>
        </div>
      </div>

      {/* Illustration */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container-low">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7GfIf4DSULRAr3AiXXz9HkzbAvhxweXbpcKLb2jwOYZkJbfcYNLAuWG1ZZU1HA2lyDX2Ct6KDBwNnAZfPa_NqeRBHDLBX2ZbRi52V9AojxsLYm9mfs_ZUWG76lrx48FJ7pUpssJYZ1M0pSziM_ovnLpYJVe2X1xsz1V1PH6xLEMsLy_eP5-q1jTG3jxXHsCSR8f6rHayLyw6RB1PSbsem_PQx6EH8uVEcDCx1Fup-Q0m6T2qEeDzl8Pe7LF2rbvaNAYlsKyEt8WZx"
          alt="Illustration of diverse Indians at a polling booth"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
