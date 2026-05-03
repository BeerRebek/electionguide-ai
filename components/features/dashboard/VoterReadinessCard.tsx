"use client";

import { useState } from "react";
import Link from "next/link";

interface ReadinessStep {
  id: string;
  icon: string;
  label: string;
  description: string;
  action?: { label: string; href: string };
}

const STEPS: ReadinessStep[] = [
  {
    id: "verify",
    icon: "how_to_reg",
    label: "Verify Registration",
    description: "Confirm you're on the voter roll",
    action: { label: "Verify Now", href: "/registration/eligibility" },
  },
  {
    id: "update",
    icon: "edit_note",
    label: "Update Details",
    description: "Correct any errors in your voter record",
    action: { label: "Update", href: "/registration" },
  },
  {
    id: "booth",
    icon: "location_on",
    label: "Find Polling Booth",
    description: "Know your assigned voting station",
    action: { label: "Find Booth", href: "/booth-finder" },
  },
  {
    id: "research",
    icon: "person_search",
    label: "Research Candidates",
    description: "Review candidate profiles and manifestos",
    action: { label: "View Candidates", href: "/candidates" },
  },
  {
    id: "reminder",
    icon: "alarm",
    label: "Set Election Day Reminder",
    description: "Don't miss election day",
  },
  {
    id: "transport",
    icon: "directions_bus",
    label: "Plan Transport",
    description: "Arrange your trip to the polling booth",
  },
  {
    id: "id",
    icon: "badge",
    label: "Gather Required ID",
    description: "Have your EPIC or valid photo ID ready",
    action: { label: "See Valid IDs", href: "/guides" },
  },
  {
    id: "vote",
    icon: "how_to_vote",
    label: "Cast Your Vote",
    description: "Exercise your democratic right!",
  },
];

const STORAGE_KEY = "electionguide_voter_readiness";

function loadChecked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set(["verify", "booth"]); // demo defaults
}

export function VoterReadinessCard() {
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked());
  const [expanded, setExpanded] = useState(false);

  const toggleStep = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const completedCount = checked.size;
  const totalCount = STEPS.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const progressColor =
    progress >= 75
      ? "bg-green-500"
      : progress >= 50
      ? "bg-secondary"
      : "bg-primary";

  const displayedSteps = expanded ? STEPS : STEPS.slice(0, 4);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                checklist
              </span>
              Voter Readiness Score
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Complete all 8 steps to be fully election-ready
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-3xl font-bold text-primary">{completedCount}</span>
            <span className="text-sm text-on-surface-variant">/{totalCount}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-on-surface-variant">Progress</span>
            <span className="text-xs font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-surface-dim rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-5 py-3 space-y-2">
        {displayedSteps.map((step, i) => {
          const isChecked = checked.has(step.id);
          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                isChecked
                  ? "bg-primary-container/20 border border-primary/20"
                  : "hover:bg-surface-container-low border border-transparent"
              }`}
              onClick={() => toggleStep(step.id)}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isChecked
                    ? "bg-primary border-primary"
                    : "border-outline-variant group-hover:border-primary"
                }`}
              >
                {isChecked && (
                  <span className="material-symbols-outlined text-on-primary text-sm">
                    check
                  </span>
                )}
              </div>

              {/* Step icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isChecked
                    ? "bg-primary-container text-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {step.icon}
                </span>
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isChecked
                      ? "line-through text-on-surface-variant"
                      : "text-on-surface"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {step.description}
                </p>
              </div>

              {/* Action link */}
              {step.action && !isChecked && (
                <Link
                  href={step.action.href}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-primary font-medium hover:underline whitespace-nowrap flex-shrink-0 hidden sm:block"
                >
                  {step.action.label} →
                </Link>
              )}

              {/* Step number badge */}
              <span className="text-[10px] text-on-surface-variant/60 font-mono flex-shrink-0">
                {i + 1}/{totalCount}
              </span>
            </div>
          );
        })}
      </div>

      {/* Show more / less toggle */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-xs text-primary font-medium flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-primary-container/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            {expanded ? "expand_less" : "expand_more"}
          </span>
          {expanded ? "Show less" : `Show all ${totalCount} steps`}
        </button>
      </div>

      {/* Completion banner */}
      {completedCount === totalCount && (
        <div className="mx-5 mb-5 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <span className="material-symbols-outlined text-green-500 text-3xl">
            celebration
          </span>
          <p className="text-sm font-bold text-green-700 dark:text-green-400 mt-1">
            🎉 You're fully election-ready!
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Share your readiness with friends
          </p>
        </div>
      )}
    </div>
  );
}
