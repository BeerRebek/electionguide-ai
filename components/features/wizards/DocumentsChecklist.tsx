"use client";

import { useState } from "react";

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  size?: string;
  options?: string[];
  tooltip: string;
  required: boolean;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: "photo",
    label: "Recent Passport-size Photograph",
    description: "Clear front-facing photo against white background",
    size: "Under 2MB, JPG/PNG",
    tooltip: "Photo must be taken within the last 6 months. Use a plain white background.",
    required: true,
  },
  {
    id: "age_proof",
    label: "Proof of Age",
    description: "Any one of the following",
    options: [
      "Birth Certificate",
      "Class 10 Marksheet / Certificate",
      "Passport",
      "PAN Card",
      "Driving Licence",
    ],
    tooltip: "Any government-issued document showing your date of birth is acceptable.",
    required: true,
  },
  {
    id: "address_proof",
    label: "Proof of Address",
    description: "Any one of the following",
    options: [
      "Aadhaar Card",
      "Bank Passbook",
      "Ration Card",
      "Electricity / Water Bill (last 3 months)",
      "Passport",
      "Driving Licence",
    ],
    tooltip: "Must show your current residential address in the constituency you want to register in.",
    required: true,
  },
];

interface Props {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  allDocuments: boolean;
  onAllDocumentsChange: (val: boolean) => void;
}

export function DocumentsChecklist({ checked, onToggle, allDocuments, onAllDocumentsChange }: Props) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Documents Checklist</h2>
        <p className="text-on-surface-variant">
          Gather these documents before starting your application. Having them ready will speed up
          the process.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {DOCUMENTS.map((doc) => {
          const isChecked = checked[doc.id];
          return (
            <div
              key={doc.id}
              className={`rounded-xl border-2 p-4 transition-all ${
                isChecked ? "border-tertiary bg-tertiary-container/10" : "border-outline-variant"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggle(doc.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? "border-tertiary bg-tertiary"
                      : "border-outline hover:border-primary"
                  }`}
                >
                  {isChecked && (
                    <span className="material-symbols-outlined text-on-tertiary text-[14px]">
                      check
                    </span>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-on-surface">{doc.label}</span>
                    {doc.required && (
                      <span className="text-[10px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setOpenTooltip(openTooltip === doc.id ? null : doc.id)
                      }
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">help_outline</span>
                    </button>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-1">{doc.description}</p>
                  {doc.size && (
                    <p className="text-xs text-outline">{doc.size}</p>
                  )}
                  {doc.options && (
                    <ul className="mt-2 space-y-1">
                      {doc.options.map((opt) => (
                        <li key={opt} className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline flex-shrink-0" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {openTooltip === doc.id && (
                    <div className="mt-3 bg-surface-container rounded-lg p-3 border border-outline-variant text-xs text-on-surface-variant flex items-start gap-2">
                      <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">info</span>
                      {doc.tooltip}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation checkbox */}
      <div className="border-t border-outline-variant pt-6">
        <button
          onClick={() => onAllDocumentsChange(!allDocuments)}
          className="flex items-start gap-3 text-left w-full group"
        >
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              allDocuments
                ? "border-primary bg-primary"
                : "border-outline group-hover:border-primary"
            }`}
          >
            {allDocuments && (
              <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
            )}
          </div>
          <div>
            <span className="font-medium text-on-surface">I have all required documents ready</span>
            <p className="text-sm text-on-surface-variant mt-0.5">
              I confirm I have scanned/photographed copies of all documents above.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
