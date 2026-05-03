"use client";

import { useState, useEffect, useRef } from "react";
import { VOTER_JOURNEY_STEPS } from "@/lib/data/election-data";

export function VoterJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= VOTER_JOURNEY_STEPS.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  function togglePlay() {
    if (activeStep >= VOTER_JOURNEY_STEPS.length - 1) {
      setActiveStep(0);
    }
    setPlaying(!playing);
  }

  const step = VOTER_JOURNEY_STEPS[activeStep];
  const progress = ((activeStep + 1) / VOTER_JOURNEY_STEPS.length) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-on-surface">Voter Journey</h2>
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-2 bg-primary-container/20 text-primary rounded-lg text-sm font-medium hover:bg-primary-container/30 transition-colors min-h-[40px]"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {playing ? "pause" : "play_arrow"}
          </span>
          {playing ? "Pause" : "Play Animation"}
        </button>
      </div>
      <p className="text-sm text-on-surface-variant mb-6">
        Step-by-step journey from entering the booth to casting your vote.
      </p>

      {/* Progress bar */}
      <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-8">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Step Selector */}
        <div className="lg:col-span-2 space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide">
          {VOTER_JOURNEY_STEPS.map((s, i) => (
            <button
              key={s.number}
              onClick={() => { setActiveStep(i); setPlaying(false); }}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                i === activeStep
                  ? "bg-primary-container/20 border border-primary shadow-sm"
                  : i < activeStep
                  ? "bg-tertiary-container/10 border border-tertiary-container/20"
                  : "bg-surface-container-lowest border border-outline-variant hover:bg-surface-container"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                i === activeStep ? "bg-primary text-on-primary" : i < activeStep ? "bg-tertiary text-on-tertiary" : "bg-surface-container text-on-surface-variant"
              }`}>
                {i < activeStep ? (
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                ) : (
                  s.number
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{s.title}</p>
                <p className="text-[10px] text-on-surface-variant">{s.duration}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Detail */}
        <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {step.icon}
              </span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Step {step.number} of {VOTER_JOURNEY_STEPS.length}</p>
              <h3 className="text-xl font-semibold text-on-surface">{step.title}</h3>
            </div>
          </div>

          <p className="text-base text-on-surface-variant mb-4">{step.description}</p>

          <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
            <p className="text-sm text-on-surface leading-relaxed">{step.detail}</p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">timer</span>
            Duration: {step.duration}
          </div>
        </div>
      </div>
    </div>
  );
}
