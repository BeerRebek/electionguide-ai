"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOK_SABHA_2024_PHASES, type TimelinePhase } from "@/lib/data/election-data";
import { TimelineHero } from "./TimelineHero";
import { TimelineFilters } from "./TimelineFilters";
import { PhaseCard } from "./PhaseCard";
import { PhaseDetailDrawer } from "./PhaseDetailDrawer";
import { EVMLifecycleBento } from "./EVMLifecycleBento";

type ViewMode = "phase" | "calendar";

export function ElectionTimeline() {
  const t = useTranslations("timeline");
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>("phase");
  const [drawerPhase, setDrawerPhase] = useState<TimelinePhase | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  // Calculate progress line width based on completed phases
  const completedCount = LOK_SABHA_2024_PHASES.filter((p) => p.status === "completed").length;
  const activeIndex = LOK_SABHA_2024_PHASES.findIndex((p) => p.status === "active");
  const progressFraction =
    activeIndex >= 0
      ? (activeIndex + 0.5) / LOK_SABHA_2024_PHASES.length
      : completedCount / LOK_SABHA_2024_PHASES.length;

  return (
    <div>
      <TimelineHero />
      <TimelineFilters viewMode={viewMode} onViewChange={setViewMode} />

      {/* Main Timeline Section */}
      <section className="mb-16 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[32px] font-semibold text-on-surface leading-[1.3] tracking-[-0.01em]">
            {t("election_phases")}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface-variant">
              {t("compare_previous")}
            </span>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                compareMode ? "bg-primary" : "bg-outline-variant"
              }`}
              role="switch"
              aria-checked={compareMode}
              aria-label={t("aria_compare")}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  compareMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {viewMode === "phase" ? (
          /* Horizontal Scroll Phase Cards */
          <div className="relative overflow-x-auto no-scrollbar pb-8 pt-4 -mx-6 px-6 lg:mx-0 lg:px-0">
            {/* Progress Line Background */}
            <div className="absolute top-[120px] left-6 lg:left-0 right-6 lg:right-0 h-1 bg-surface-container-high rounded-full z-0 hidden md:block" />
            {/* Active Progress Line */}
            <div
              className="absolute top-[120px] left-6 lg:left-0 h-1 bg-primary rounded-full z-0 hidden md:block transition-all duration-700"
              style={{ width: `${progressFraction * 100}%` }}
            />

            <div className="flex gap-6 min-w-max relative z-10">
              {LOK_SABHA_2024_PHASES.map((phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  onOpenDrawer={setDrawerPhase}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LOK_SABHA_2024_PHASES.map((phase) => {
                const start = new Date(phase.startDate);
                const end = new Date(phase.endDate);
                return (
                  <button
                    key={phase.id}
                    onClick={() => setDrawerPhase(phase)}
                    className="bg-surface border border-outline-variant rounded-lg p-4 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-[16px]">
                          {phase.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-on-surface truncate">
                          {phase.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          {start.toLocaleDateString(locale, { month: "short", day: "numeric" })}
                          {start.getTime() !== end.getTime() &&
                            ` – ${end.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          phase.status === "completed"
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : phase.status === "active"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {phase.status === "completed" ? "✓" : phase.status === "active" ? "●" : "○"}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 group-hover:text-on-surface transition-colors">
                      {phase.bite}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* EVM/VVPAT Lifecycle Bento Grid */}
      <EVMLifecycleBento />

      {/* Phase Detail Drawer */}
      <PhaseDetailDrawer
        phase={drawerPhase}
        onClose={() => setDrawerPhase(null)}
      />
    </div>
  );
}
