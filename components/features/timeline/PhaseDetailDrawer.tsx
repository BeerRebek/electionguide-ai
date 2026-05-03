"use client";

import { useEffect, useRef } from "react";
import type { TimelinePhase } from "@/lib/data/election-data";

interface PhaseDetailDrawerProps {
  phase: TimelinePhase | null;
  onClose: () => void;
}

export function PhaseDetailDrawer({ phase, onClose }: PhaseDetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!phase) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [phase, onClose]);

  if (!phase) return null;

  const { meal } = phase;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${phase.title} — Full Details`}
        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-surface-container-lowest border-l border-outline-variant z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {phase.icon}
              </span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Phase {phase.number}</p>
              <h2 className="text-lg font-semibold text-on-surface">{phase.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {phase.dateRange}
          </div>

          {/* Overview (MEAL) */}
          <section>
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{meal.overview}</p>
          </section>

          {/* Key Dates */}
          {meal.keyDates.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">Key Dates</h3>
              <div className="space-y-2">
                {meal.keyDates.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      event
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{item.date}</p>
                      <p className="text-xs text-on-surface-variant">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Legal References */}
          <section>
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">Legal References</h3>
            <div className="space-y-1.5">
              {meal.legalRefs.map((ref, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">gavel</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{ref}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Authorities */}
          <section>
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">Authorities Involved</h3>
            <div className="flex flex-wrap gap-2">
              {meal.authorities.map((auth) => (
                <span key={auth} className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container border border-outline-variant rounded-full text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                  {auth}
                </span>
              ))}
            </div>
          </section>

          {/* Documentation */}
          <section>
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-3">Documentation</h3>
            <div className="space-y-1.5">
              {meal.documentation.map((doc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">description</span>
                  <p className="text-xs text-on-surface-variant">{doc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Party Role */}
          <section className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">groups</span>
              <h3 className="text-sm font-semibold text-on-surface">Political Party Role</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{meal.partyRole}</p>
          </section>
        </div>
      </div>
    </>
  );
}
