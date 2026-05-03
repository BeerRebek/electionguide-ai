"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "who", label: "Who is an NRI Voter?", icon: "public" },
  { id: "eligibility", label: "Eligibility & Conditions", icon: "fact_check" },
  { id: "form6a", label: "Form 6A Process", icon: "description" },
  { id: "documents", label: "Required Documents", icon: "folder" },
  { id: "voting", label: "How to Vote", icon: "how_to_vote" },
  { id: "proxy", label: "Proxy Voting (Proposed)", icon: "how_to_vote" },
  { id: "done", label: "Done!", icon: "celebration" },
];

const CONTENT = [
  {
    title: "Who is an NRI (Overseas) Voter?",
    content: "An Indian citizen who is residing outside India due to employment, education, or any other reason (not voluntarily acquired foreign citizenship) is eligible to register as an NRI voter.",
    items: [
      { icon: "flight", label: "Living abroad", note: "Temporarily absent due to work, education, or other reasons" },
      { icon: "flag", label: "Indian Passport holder", note: "Must hold a valid Indian passport" },
      { icon: "home", label: "Home constituency intact", note: "Registered address must be in India" },
      { icon: "block", label: "Not OCI/PIO card holders", note: "OCI card holders are NOT eligible for NRI voting" },
    ],
  },
  {
    title: "Eligibility Conditions",
    items: [
      { icon: "person", label: "Indian Citizen only", note: "Must NOT have acquired citizenship of another country" },
      { icon: "cake", label: "18 years or older", note: "On the qualifying date (Jan 1 of that year)" },
      { icon: "passport", label: "Valid Indian Passport", note: "Passport number required for Form 6A" },
      { icon: "home_pin", label: "Address in India", note: "Home address as per passport must be in a constituency" },
      { icon: "how_to_vote", label: "Not already enrolled", note: "Cannot be registered at any other constituency" },
    ],
  },
  {
    title: "Form 6A — The NRI Registration Form",
    content: "Form 6A is specifically designed for overseas electors. You must file it online through the NVSP portal.",
    steps: [
      "Visit voters.eci.gov.in and click 'New Registration (Form 6A)'",
      "Enter your Indian passport number and place of birth",
      "Provide the address in India (as shown in passport)",
      "Enter your current address abroad (mandatory)",
      "Upload required documents (see next step)",
      "Submit — note your reference number",
    ],
    tip: "If your Indian address has changed since passport issuance, attach a self-declaration explaining the discrepancy.",
  },
  {
    title: "Required Documents for Form 6A",
    items: [
      { icon: "passport", label: "Copy of Indian Passport", note: "Photo page + address page" },
      { icon: "photo_camera", label: "Recent passport-size photo", note: "White background, under 2MB" },
      { icon: "home", label: "Proof of address in India", note: "As per passport — Aadhaar, utility bill, etc." },
      { icon: "work", label: "Proof of stay abroad (optional)", note: "Visa page, work permit, or student ID" },
    ],
  },
  {
    title: "How NRI Voters Cast Their Vote",
    content: "Currently, NRI voters must travel to India to vote in person at their registered polling station. There is no postal ballot provision for NRIs yet.",
    items: [
      { icon: "flight_land", label: "Travel to India", note: "During the polling period" },
      { icon: "badge", label: "Carry Indian Passport", note: "Primary ID at polling station" },
      { icon: "location_on", label: "Vote at registered booth", note: "In the constituency listed on your Form 6A" },
      { icon: "how_to_vote", label: "Normal voting process", note: "Same as any other voter using EVM" },
    ],
    tip: "Check election schedules early to plan your travel. Elections are announced 4-6 weeks in advance.",
  },
  {
    title: "Proxy Voting for NRIs (Proposed Bill)",
    content: "The Indian government has proposed allowing NRIs to vote via a trusted proxy in India. While not yet law, the Representation of the People (Amendment) Bill, 2017 was passed in Lok Sabha.",
    items: [
      { icon: "pending", label: "Bill status: Pending in Rajya Sabha", note: "Not yet enacted as of 2024" },
      { icon: "person_add", label: "Proposed: Appoint a proxy", note: "Any relative of the NRI voter in the constituency" },
      { icon: "how_to_vote", label: "Proxy votes on your behalf", note: "Cannot vote for someone else simultaneously" },
      { icon: "notifications_active", label: "Stay updated", note: "Monitor ECI website for final enactment" },
    ],
    warning: "Do not let anyone claim proxy voting is already legal — it is NOT yet. The bill is still pending.",
  },
];

export default function NriVotingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const content = CONTENT[currentStep] || null;
  const completedSteps = STEPS.slice(0, 6).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="NRI Voting Guide (Form 6A)"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
      canGoNext={currentStep < STEPS.length - 1}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip="NRI voters must physically travel to India to vote. There is no overseas voting provision yet."
      backHref="/guides"
    >
      {currentStep === STEPS.length - 1 ? (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm="Form 6A"
          wizardTitle="NRI Voting Guide"
          nextHref="/guides/voter-registration"
          nextLabel="Start Registration Wizard"
        />
      ) : content ? (
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-4">{content.title}</h2>
          {content.content && (
            <p className="text-on-surface-variant mb-4">{content.content}</p>
          )}
          {content.items && (
            <div className="space-y-3 mb-4">
              {content.items.map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-[24px]">{item.icon}</span>
                  <div>
                    <p className="font-medium text-on-surface text-sm">{item.label}</p>
                    <p className="text-xs text-on-surface-variant">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {content.steps && (
            <div className="space-y-2 mb-4">
              {content.steps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                  <p className="text-sm text-on-surface">{step}</p>
                </div>
              ))}
            </div>
          )}
          {content.warning && (
            <div className="bg-error-container/30 rounded-xl p-4 border border-error-container flex items-start gap-3 mt-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-sm text-on-surface-variant">{content.warning}</p>
            </div>
          )}
          {content.tip && (
            <div className="bg-tertiary-container/30 rounded-xl p-4 border border-tertiary-container flex items-start gap-3 mt-4">
              <span className="material-symbols-outlined text-tertiary">lightbulb</span>
              <p className="text-sm text-on-surface-variant">{content.tip}</p>
            </div>
          )}
        </div>
      ) : null}
    </WizardLayout>
  );
}
