"use client";

import { useState } from "react";
import Link from "next/link";

export interface WizardStep {
  id: string;
  label: string;
  icon: string;
  completed?: boolean;
  skipped?: boolean;
}

interface WizardLayoutProps {
  title: string;
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSaveExit?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  canGoNext?: boolean;
  children: React.ReactNode;
  tip?: string;
  backHref?: string;
}

export function WizardLayout({
  title,
  steps,
  currentStep,
  onNext,
  onPrev,
  onSaveExit,
  nextLabel = "Continue",
  prevLabel = "Previous",
  canGoNext = true,
  children,
  tip,
  backHref = "/guides",
}: WizardLayoutProps) {
  const [saved, setSaved] = useState(false);
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleSaveExit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaveExit?.();
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={backHref}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-on-surface truncate">{title}</h1>
              <p className="text-xs text-on-surface-variant">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-xs text-on-surface-variant mb-1">
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-tertiary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Saved
              </span>
            )}
            <button
              onClick={handleSaveExit}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-surface-container flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span className="hidden sm:inline">Save & Exit</span>
            </button>
          </div>
        </div>
        {/* Mobile progress */}
        <div className="md:hidden h-1 bg-surface-container">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sticky top-24">
            <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4 px-2">
              Steps
            </h2>
            <nav className="space-y-1">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep || step.completed;
                const isSkipped = step.skipped;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary-container text-on-primary-container font-medium"
                        : isCompleted
                        ? "text-on-surface-variant"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 border ${
                        isActive
                          ? "bg-primary text-on-primary border-primary"
                          : isCompleted
                          ? "bg-tertiary text-on-tertiary border-tertiary"
                          : "border-outline-variant bg-surface"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        <span className="text-[11px] font-semibold">{idx + 1}</span>
                      )}
                    </div>
                    <span className="truncate">{step.label}</span>
                    {isSkipped && (
                      <span className="ml-auto text-[10px] text-outline">skip</span>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Tip Card */}
            {tip && (
              <div className="mt-6 bg-tertiary-container/40 rounded-lg p-3 border border-tertiary-container">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px] flex-shrink-0 mt-0.5">
                    lightbulb
                  </span>
                  <p className="text-xs text-on-surface-variant">{tip}</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile step indicator */}
          <div className="lg:hidden flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx < currentStep
                    ? "bg-tertiary"
                    : idx === currentStep
                    ? "bg-primary"
                    : "bg-surface-container"
                }`}
              />
            ))}
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 min-h-[400px] shadow-sm">
            {children}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[48px]"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              {prevLabel}
            </button>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary-fixed hover:text-on-primary-fixed disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[48px] shadow-sm"
            >
              {nextLabel}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
