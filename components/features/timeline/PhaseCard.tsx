"use client";

import Link from "next/link";
import { type TimelinePhase } from "@/lib/data/election-data";

interface PhaseCardProps {
  phase: TimelinePhase;
  onOpenDrawer: (phase: TimelinePhase) => void;
}

const STATUS_STYLES = {
  completed: {
    badge: "bg-primary-fixed text-on-primary-fixed",
    circle: "bg-primary text-on-primary shadow-md",
    border: "border-primary shadow-[0_4px_20px_-4px_rgba(0,35,111,0.1)]",
    topBar: "bg-primary",
    opacity: "",
    label: "Completed",
    iconFill: true,
  },
  active: {
    badge: "bg-surface-variant text-on-surface-variant",
    circle: "bg-surface-container-high text-primary shadow-sm",
    border: "border-outline-variant hover:shadow-md",
    topBar: "bg-secondary-container",
    opacity: "opacity-90",
    label: "Active",
    iconFill: true,
  },
  upcoming: {
    badge: "bg-surface text-on-surface-variant border border-outline-variant",
    circle: "bg-surface-container text-outline shadow-sm",
    border: "border-outline-variant",
    topBar: "",
    opacity: "opacity-70",
    label: "Upcoming",
    iconFill: false,
  },
};

export function PhaseCard({ phase, onOpenDrawer }: PhaseCardProps) {
  const s = STATUS_STYLES[phase.status];

  return (
    <div className={`w-[320px] flex-shrink-0 flex flex-col group ${s.opacity}`}>
      {/* Circle Connector */}
      <div className="mb-4 flex justify-center md:justify-start relative">
        <div
          className={`w-12 h-12 rounded-full ${s.circle} flex items-center justify-center border-4 border-white z-10 relative`}
        >
          <span
            className="material-symbols-outlined"
            style={s.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {phase.icon}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <button
        onClick={() => onOpenDrawer(phase)}
        className={`bg-surface-container-lowest ${s.border} rounded-xl p-5 shadow-sm transition-shadow h-full flex flex-col text-left relative overflow-hidden cursor-pointer`}
      >
        {/* Top Bar Accent */}
        {s.topBar && <div className={`absolute top-0 left-0 w-full h-1 ${s.topBar}`} />}

        {/* Status + Date */}
        <div className="flex justify-between items-start mb-3">
          <span className={`${s.badge} text-xs font-medium px-2 py-1 rounded-full`}>
            {s.label}
          </span>
          <span className="text-xs text-on-surface-variant">{phase.dateRange}</span>
        </div>

        {/* Title + Bite */}
        <h3 className="text-2xl font-semibold text-on-surface mb-2 leading-snug">{phase.title}</h3>
        <p className="text-base text-on-surface-variant mb-4 flex-grow leading-relaxed">
          {phase.bite}
        </p>

        {/* Stat Bar (completed phases) */}
        {phase.statLabel && phase.statValue && (
          <div className="bg-surface p-3 rounded-lg border border-outline-variant mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-on-surface">{phase.statLabel}</span>
              <span className="text-sm font-medium text-primary">{phase.statValue}</span>
            </div>
            {phase.statPercent !== undefined && (
              <div className="w-full bg-surface-container-high rounded-full h-1.5">
                <div
                  className="bg-tertiary-fixed-dim h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${phase.statPercent}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {phase.tags.length > 0 && !phase.statLabel && (
          <div className="flex flex-wrap gap-2 mb-4">
            {phase.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-surface border border-outline-variant rounded-full text-xs text-on-surface"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <Link
          href={`/chat?q=${encodeURIComponent(`Tell me about the ${phase.title} phase of Indian elections`)}`}
          className="flex-1 bg-primary-container/10 text-primary-container text-sm font-medium py-2 rounded-lg hover:bg-primary-container/20 transition-colors flex items-center justify-center gap-1 min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          Ask AI
        </Link>
        <button
          onClick={() => {
            // Calendar export for this phase
            const icsContent = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "BEGIN:VEVENT",
              `DTSTART:${phase.startDate.replace(/-/g, "")}`,
              `DTEND:${phase.endDate.replace(/-/g, "")}`,
              `SUMMARY:${phase.title} — Indian Elections`,
              `DESCRIPTION:${phase.bite}`,
              "END:VEVENT",
              "END:VCALENDAR",
            ].join("\n");
            const blob = new Blob([icsContent], { type: "text/calendar" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${phase.id}-election.ics`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label={`Add ${phase.title} to calendar`}
        >
          <span className="material-symbols-outlined">event</span>
        </button>
      </div>
    </div>
  );
}
