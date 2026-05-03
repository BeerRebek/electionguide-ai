"use client";

import { useState } from "react";

interface Criterion {
  id: string;
  label: string;
  description: string;
  icon: string;
  required: boolean;
}

const CRITERIA: Criterion[] = [
  {
    id: "citizen",
    label: "Indian Citizen",
    description: "You must be a citizen of India",
    icon: "flag",
    required: true,
  },
  {
    id: "age",
    label: "18 Years or Older",
    description: "You must be at least 18 years old on the qualifying date",
    icon: "calendar_today",
    required: true,
  },
  {
    id: "resident",
    label: "Ordinary Resident of Constituency",
    description: "You must be ordinarily resident of the constituency where you want to register",
    icon: "home",
    required: true,
  },
  {
    id: "sound_mind",
    label: "Not Declared of Unsound Mind",
    description: "Not been declared unsound of mind by a competent court",
    icon: "psychology",
    required: true,
  },
  {
    id: "not_disqualified",
    label: "Not Disqualified by Law",
    description: "Not disqualified from voting under any law relating to corrupt practices or election offences",
    icon: "gavel",
    required: true,
  },
];

type ResultState = "idle" | "eligible" | "ineligible";

interface Props {
  onEligible: () => void;
}

export function EligibilityCheck({ onEligible }: Props) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ResultState>("idle");
  const [failedCriteria, setFailedCriteria] = useState<string[]>([]);

  const toggle = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
    setResult("idle");
  };

  const handleCheck = () => {
    const failed = CRITERIA.filter((c) => c.required && !checks[c.id]).map((c) => c.label);
    if (failed.length === 0) {
      setResult("eligible");
      onEligible();
    } else {
      setResult("ineligible");
      setFailedCriteria(failed);
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Eligibility Check</h2>
        <p className="text-on-surface-variant">
          Confirm you meet all the requirements to register as a voter in India.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {CRITERIA.map((criterion) => {
          const isChecked = checks[criterion.id];
          return (
            <button
              key={criterion.id}
              onClick={() => toggle(criterion.id)}
              className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-200 ${
                isChecked
                  ? "border-tertiary bg-tertiary-container/20"
                  : "border-outline-variant hover:border-outline hover:bg-surface-container"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isChecked
                    ? "border-tertiary bg-tertiary"
                    : "border-outline"
                }`}
              >
                {isChecked && (
                  <span className="material-symbols-outlined text-on-tertiary text-[14px]">
                    check
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
                    isChecked ? "text-tertiary" : "text-on-surface-variant"
                  }`}
                >
                  {criterion.icon}
                </span>
                <div>
                  <p className="font-medium text-on-surface text-sm">{criterion.label}</p>
                  <p className="text-xs text-on-surface-variant">{criterion.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {result === "idle" && (
        <button
          onClick={handleCheck}
          className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span className="material-symbols-outlined">fact_check</span>
          Check My Eligibility
        </button>
      )}

      {result === "eligible" && (
        <div className="bg-tertiary-container rounded-xl p-6 border border-tertiary flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="material-symbols-outlined text-tertiary text-[32px]">check_circle</span>
          <div>
            <h3 className="font-bold text-on-surface text-lg mb-1">✅ You are Eligible!</h3>
            <p className="text-on-surface-variant text-sm">
              You meet all the requirements to register as a voter in India. Let&apos;s continue to the
              next step.
            </p>
          </div>
        </div>
      )}

      {result === "ineligible" && (
        <div className="bg-error-container rounded-xl p-6 border border-error animate-in fade-in duration-300">
          <div className="flex items-start gap-4 mb-4">
            <span className="material-symbols-outlined text-error text-[32px]">cancel</span>
            <div>
              <h3 className="font-bold text-on-error-container text-lg mb-1">
                ❌ Not Currently Eligible
              </h3>
              <p className="text-on-error-container/80 text-sm">
                You do not meet the following requirements:
              </p>
            </div>
          </div>
          <ul className="space-y-1 ml-12">
            {failedCriteria.map((c) => (
              <li key={c} className="text-sm text-on-error-container flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[16px]">close</span>
                {c}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setResult("idle"); setChecks({}); }}
            className="mt-4 text-sm text-primary underline"
          >
            Reset and try again
          </button>
        </div>
      )}
    </div>
  );
}
