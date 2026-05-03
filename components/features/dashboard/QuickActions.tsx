"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");

  const QUICK_ACTIONS = [
    { icon: "smart_toy", label: t("askAI"), href: "/chat" },
    { icon: "location_on", label: t("findBooth"), href: "/booth-finder" },
    { icon: "how_to_reg", label: t("verifyName"), href: "/registration/eligibility" },
    { icon: "quiz", label: t("takeQuiz"), href: "/quiz" },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant hover:border-primary hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 group h-32"
        >
          <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined">{action.icon}</span>
          </div>
          <span className="text-sm font-medium text-on-surface text-center">{action.label}</span>
        </Link>
      ))}
    </section>
  );
}
