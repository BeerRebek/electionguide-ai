"use client";

import type { TimelinePhase } from "@/lib/data/election-data";

interface Props {
  phases: TimelinePhase[];
  onSelectPhase: (phase: TimelinePhase) => void;
}

const STATUS_COLORS = {
  completed: { node: "bg-tertiary text-on-tertiary", line: "bg-tertiary" },
  active: { node: "bg-primary text-on-primary animate-pulse", line: "bg-primary" },
  upcoming: { node: "bg-surface-container text-on-surface-variant", line: "bg-outline-variant" },
};

export function TimelineVisualization({ phases, onSelectPhase }: Props) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">timeline</span>
        Visual Timeline
      </h2>

      {/* Desktop: Horizontal */}
      <div className="hidden md:block overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start min-w-max px-4">
          {phases.map((phase, i) => {
            const cfg = STATUS_COLORS[phase.status];
            return (
              <div key={phase.id} className="flex items-start">
                <button onClick={() => onSelectPhase(phase)} className="flex flex-col items-center group cursor-pointer w-[160px]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 ${cfg.node} transition-transform group-hover:scale-110`}>
                    <span className="material-symbols-outlined text-[20px]" style={phase.status === "completed" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {phase.status === "completed" ? "check" : phase.icon}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface mt-2 text-center leading-tight">{phase.title}</p>
                  <p className="text-[10px] text-on-surface-variant text-center mt-0.5">{phase.dateRange}</p>
                </button>
                {i < phases.length - 1 && (
                  <div className="flex items-center mt-[22px] -mx-2">
                    <div className={`h-0.5 w-16 ${cfg.line} rounded-full`} />
                    <span className="material-symbols-outlined text-[14px] -mx-1 text-outline-variant">chevron_right</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden relative pl-8">
        <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-outline-variant" />
        <div className="space-y-6">
          {phases.map((phase) => {
            const cfg = STATUS_COLORS[phase.status];
            return (
              <button key={phase.id} onClick={() => onSelectPhase(phase)} className="flex items-start gap-4 w-full text-left group">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 flex-shrink-0 -ml-[26px] ${cfg.node}`}>
                  <span className="material-symbols-outlined text-[16px]" style={phase.status === "completed" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {phase.status === "completed" ? "check" : phase.icon}
                  </span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex-1 group-hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-on-surface">{phase.title}</p>
                    <span className="text-[10px] text-on-surface-variant whitespace-nowrap ml-2">{phase.dateRange}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{phase.bite}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
