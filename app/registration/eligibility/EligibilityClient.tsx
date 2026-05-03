"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  eligible: boolean;
  reason: string;
  nextStep: string;
  nextHref: string;
};

export function EligibilityClient() {
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("indian");
  const [state, setState] = useState("");
  const [alreadyReg, setAlreadyReg] = useState<"yes" | "no" | "unsure" | "">("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const checkEligibility = () => {
    setError("");
    setResult(null);

    if (!dob) { setError("Please enter your date of birth."); return; }
    if (!state) { setError("Please select your state of residence."); return; }
    if (!alreadyReg) { setError("Please indicate your registration status."); return; }

    // Age calculation using qualifying date (Jan 1 of current year as cutoff)
    const dobDate = new Date(dob);
    const qualifying = new Date(new Date().getFullYear(), 0, 1); // Jan 1 current year
    let age = qualifying.getFullYear() - dobDate.getFullYear();
    const m = qualifying.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && qualifying.getDate() < dobDate.getDate())) age--;

    if (age < 18) {
      setResult({
        eligible: false,
        reason: `You are ${age} years old. You must be at least 18 years old on January 1st of the qualifying year to register.`,
        nextStep: "You can apply when you turn 18. Set a reminder!",
        nextHref: "/registration",
      });
      return;
    }

    if (nationality === "nri") {
      setResult({
        eligible: true,
        reason: `As an NRI aged ${age}, you can register under Section 20A of the Representation of the People Act, 1950 using Form 6A.`,
        nextStep: alreadyReg === "yes" ? "Check your registration status" : "Apply with Form 6A (NRI)",
        nextHref: alreadyReg === "yes" ? "/registration/status" : "/registration/new",
      });
      return;
    }

    if (alreadyReg === "yes") {
      setResult({
        eligible: true,
        reason: `You appear to be eligible (age ${age}, Indian citizen, ${state}). You are already registered.`,
        nextStep: "Verify your registration status",
        nextHref: "/registration/status",
      });
      return;
    }

    setResult({
      eligible: true,
      reason: `You are eligible to vote! You are ${age} years old, an Indian citizen residing in ${state}.`,
      nextStep: alreadyReg === "no" ? "Register now with Form 6" : "Check if you are on the electoral roll",
      nextHref: alreadyReg === "no" ? "/registration/new" : "/registration/status",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="space-y-5">
          {/* DOB */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">
              Date of Birth <span className="text-error">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">
              Nationality <span className="text-error">*</span>
            </label>
            <div className="flex gap-4">
              {[
                { val: "indian", label: "Indian Citizen" },
                { val: "nri", label: "NRI (Non-Resident Indian)" },
              ].map((opt) => (
                <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nationality"
                    value={opt.val}
                    checked={nationality === opt.val}
                    onChange={() => setNationality(opt.val)}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-on-surface text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">
              State of Residence <span className="text-error">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select State…</option>
              {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Already registered */}
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">
              Are you already on the electoral roll? <span className="text-error">*</span>
            </label>
            <div className="flex gap-5">
              {([["yes","Yes"],["no","No"],["unsure","Not Sure"]] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="registered"
                    checked={alreadyReg === val}
                    onChange={() => setAlreadyReg(val)}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-on-surface text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-error text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </p>
          )}

          <button
            onClick={checkEligibility}
            className="w-full bg-primary text-on-primary h-12 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Check My Eligibility
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-xl border p-5 flex gap-4 ${
            result.eligible
              ? "bg-[color-mix(in_srgb,var(--md-sys-color-primary-container)_30%,transparent)] border-primary-container"
              : "bg-[color-mix(in_srgb,var(--md-sys-color-error-container)_30%,transparent)] border-error-container"
          }`}
        >
          <span
            className={`material-symbols-outlined text-3xl flex-shrink-0 mt-0.5 ${
              result.eligible ? "text-primary" : "text-error"
            }`}
          >
            {result.eligible ? "check_circle" : "cancel"}
          </span>
          <div className="flex-1">
            <p
              className={`font-semibold text-base mb-1 ${
                result.eligible ? "text-on-primary-container" : "text-on-error-container"
              }`}
            >
              {result.eligible ? "✅ You are Eligible to Vote!" : "❌ Not Yet Eligible"}
            </p>
            <p className="text-sm text-on-surface-variant mb-3">{result.reason}</p>
            <Link
              href={result.nextHref}
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {result.nextStep}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">info</span>
        <p className="text-sm text-on-surface-variant">
          To be eligible you must be an Indian citizen aged 18+ on <strong>January 1st</strong> of the qualifying year.
          NRIs can register under Section 20A of the R.P. Act 1950.
        </p>
      </div>
    </div>
  );
}
