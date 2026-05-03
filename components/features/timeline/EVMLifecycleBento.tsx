"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const EVM_STAGES = [
  { number: 1, icon: "factory", key: "flc" },
  { number: 2, icon: "shuffle", key: "random" },
  { number: 3, icon: "how_to_vote", key: "mock" },
  { number: 4, icon: "lock", key: "strong" },
] as const;

export function EVMLifecycleBento() {
  const t = useTranslations("evm");

  return (
    <section className="mb-16">
      <h2 className="text-[32px] font-semibold text-on-surface mb-6 leading-[1.3] tracking-[-0.01em]">
        {t("heading")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Featured Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-surface-container-low to-surface-container-highest border border-outline-variant rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-white border border-outline-variant rounded-full text-xs text-primary mb-4 shadow-sm font-medium">
              {t("secure_tech")}
            </span>
            <h3 className="text-[32px] font-semibold text-primary mb-4 leading-[1.3] tracking-[-0.01em]">
              {t("concept_to_storage")}
            </h3>
            <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
              {t("protocols_desc")}
            </p>
            <Link
              href="/guides/evm-vvpat"
              className="bg-primary text-on-primary text-sm font-medium px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-2 min-h-[48px]"
            >
              {t("explore_protocols")}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Stage Cards */}
        {EVM_STAGES.map((stage) => (
          <div
            key={stage.number}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined">{stage.icon}</span>
            </div>
            <h4 className="text-2xl font-semibold text-on-surface mb-2 leading-snug">
              {stage.number}. {t(`stages.${stage.key}_title`)}
            </h4>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {t(`stages.${stage.key}_desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
