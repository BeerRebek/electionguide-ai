"use client";

import { useState } from "react";
import Link from "next/link";

const FIELDS_CORRECTABLE = [
  { id: "name", label: "Name Correction", desc: "Fix spelling errors in your name", form: "Form 8" },
  { id: "dob", label: "Date of Birth", desc: "Correct your date of birth", form: "Form 8" },
  { id: "address", label: "Address Change", desc: "Update your residential address within the same constituency", form: "Form 8A" },
  { id: "photo", label: "Photo Update", desc: "Replace a blurry or outdated photo", form: "Form 8" },
  { id: "transfer", label: "Constituency Transfer", desc: "Transfer registration to a new constituency", form: "Form 6" },
];

type Step = "select" | "form" | "done";

export default function CorrectionClient() {
  const [selected, setSelected] = useState<typeof FIELDS_CORRECTABLE[number] | null>(null);
  const [epic, setEpic] = useState("");
  const [correction, setCorrection] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [refNum] = useState(() => "COR" + Math.floor(10000000 + Math.random() * 90000000));

  if (step === "done") return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-4xl text-primary">task_alt</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface mb-2">Correction Submitted!</h2>
      <p className="text-on-surface-variant mb-1">Your correction request ({selected?.form}) has been submitted.</p>
      <p className="text-sm text-on-surface-variant mb-6">Reference: <strong className="text-primary">{refNum}</strong></p>
      <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
        Changes will be reviewed by the ERO within 30 days. You can track the status using your reference number.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/registration/status" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Track Status
        </Link>
        <Link href="/registration" className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
          Back to Registration
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {step === "select" && (<>
        <p className="text-sm text-on-surface-variant">Select the type of correction you need:</p>
        <div className="space-y-3">
          {FIELDS_CORRECTABLE.map((f) => (
            <button
              key={f.id}
              onClick={() => { setSelected(f); setStep("form"); }}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${selected?.id === f.id ? "border-primary bg-primary-container/30" : "border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low"}`}
            >
              <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">edit_note</span>
              <div className="flex-1">
                <p className="font-semibold text-on-surface text-sm">{f.label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{f.desc}</p>
              </div>
              <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium">{f.form}</span>
            </button>
          ))}
        </div>
      </>)}

      {step === "form" && selected && (<>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setStep("select")} className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Change selection
          </button>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">edit_note</span>
            <div>
              <h2 className="text-base font-semibold text-on-surface">{selected.label}</h2>
              <p className="text-xs text-on-surface-variant">{selected.form}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">Your Current Voter ID (EPIC) <span className="text-error">*</span></label>
            <input
              type="text"
              value={epic}
              onChange={(e) => setEpic(e.target.value)}
              placeholder="e.g. NDX1234567"
              className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">
              {selected.id === "name" ? "Corrected Name (as per official document)" :
               selected.id === "dob" ? "Correct Date of Birth" :
               selected.id === "address" ? "New Address" :
               selected.id === "transfer" ? "New Constituency / Polling Area" :
               "Details of correction required"}
              <span className="text-error"> *</span>
            </label>
            <textarea
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              rows={3}
              placeholder={
                selected.id === "name" ? "Enter your correctly spelled name..." :
                selected.id === "address" ? "Enter your full new address..." :
                "Describe the correction needed..."
              }
              className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors group">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">upload_file</span>
            <p className="text-sm font-medium text-on-surface mt-1">Upload supporting document</p>
            <p className="text-xs text-on-surface-variant">JPG, PNG or PDF · Max 2MB</p>
          </div>

          <button
            onClick={() => { if (epic && correction) setStep("done"); }}
            disabled={!epic || !correction}
            className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Submit Correction Request
          </button>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">info</span>
          <p className="text-sm text-on-surface-variant">
            After submission, visit your local Electoral Registration Office with original documents for verification. Corrections typically take 30 days to reflect.
          </p>
        </div>
      </>)}
    </div>
  );
}
