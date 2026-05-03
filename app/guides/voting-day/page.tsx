"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "prepare", label: "What to Carry", icon: "backpack" },
  { id: "booth", label: "Find Your Booth", icon: "location_on" },
  { id: "queue", label: "At the Polling Station", icon: "queue" },
  { id: "verify", label: "Identity Verification", icon: "badge" },
  { id: "vote", label: "Casting Your Vote", icon: "how_to_vote" },
  { id: "vvpat", label: "VVPAT Slip", icon: "receipt" },
  { id: "rights", label: "Your Rights", icon: "gavel" },
  { id: "done", label: "Done!", icon: "celebration" },
];

const CONTENT = [
  {
    title: "What to Carry on Voting Day",
    items: [
      { icon: "badge", label: "Voter ID Card (EPIC)", note: "Primary ID document" },
      { icon: "fingerprint", label: "Aadhaar Card", note: "Alternative ID if EPIC not available" },
      { icon: "drive_eta", label: "Driving Licence", note: "Alternative photo ID" },
      { icon: "article", label: "Voter Slip", note: "Distributed by BLO before election" },
    ],
    warning: "You MUST carry one valid photo ID. The Voter Slip alone is NOT sufficient.",
  },
  {
    title: "Find Your Polling Station",
    content: "Your polling station is assigned based on your registered address. You can find it using your EPIC number on voters.eci.gov.in or the Voter Helpline App.",
    steps: [
      "Visit voters.eci.gov.in",
      "Click 'Know Your Polling Booth'",
      "Enter your EPIC number or search by name",
      "Note the station address and get directions",
    ],
  },
  {
    title: "At the Polling Station",
    items: [
      { icon: "schedule", label: "Arrive early", note: "Booths open at 7 AM, close at 6 PM" },
      { icon: "queue", label: "Join the queue", note: "Maintain social distance" },
      { icon: "no_photography", label: "No phones inside", note: "Photography not allowed" },
      { icon: "campaign", label: "No campaigning", note: "Silence zone within 100m" },
    ],
  },
  {
    title: "Identity Verification",
    content: "A polling officer will verify your identity and mark your name on the electoral roll. Your left index finger will be marked with indelible ink.",
    steps: [
      "Present your Voter ID and photo ID",
      "Polling officer checks electoral roll",
      "Sign / thumbprint on Form 17A",
      "Receive ballot slip or be directed to EVM",
    ],
    warning: "If your name is not in the roll, you can cast a Challenged Vote (Tendered Ballot) by applying to the Presiding Officer.",
  },
  {
    title: "Casting Your Vote on EVM",
    content: "The Electronic Voting Machine (EVM) is simple and secure. Here's how to vote:",
    steps: [
      "Take your position at the voting compartment",
      "Find your candidate on the ballot unit",
      "Press the blue button next to your candidate",
      "Wait for the BEEP confirming your vote",
    ],
    tip: "You can NOTA (None of the Above) if you disapprove all candidates. It's the last button.",
  },
  {
    title: "Understanding the VVPAT Slip",
    content: "After pressing the EVM button, a paper slip will appear in the VVPAT (Voter Verifiable Paper Audit Trail) window for 7 seconds.",
    steps: [
      "Look at the VVPAT display window",
      "Verify: candidate name, symbol, and serial number",
      "The slip drops automatically into a sealed box",
      "You CANNOT take the slip home",
    ],
    tip: "If you see a wrong candidate's name on the VVPAT, immediately notify the Presiding Officer before leaving.",
  },
  {
    title: "Your Rights at the Polling Station",
    items: [
      { icon: "support_agent", label: "Right to assistance", note: "Disabled voters can bring a companion" },
      { icon: "priority_high", label: "Right to complain", note: "Fill Form 49MA for any grievance" },
      { icon: "accessible", label: "Priority entry", note: "Senior citizens and PwD voters get priority" },
      { icon: "block", label: "Refuse wrongful denial", note: "You cannot be turned away without reason" },
    ],
  },
];

export default function VotingDayWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const content = CONTENT[currentStep] || null;

  const completedSteps = STEPS.slice(0, 7).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="Voting Day Guide"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
      canGoNext={currentStep < STEPS.length - 1}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip="Polling booths are open 7 AM – 6 PM on election day. Arrive early to avoid crowds."
      backHref="/guides"
    >
      {currentStep === STEPS.length - 1 ? (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm="Voting Day Procedures"
          wizardTitle="Voting Day Guide"
          nextHref="/quiz"
          nextLabel="Test Your Knowledge with a Quiz"
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
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant"
                >
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
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-on-surface">{step}</p>
                </div>
              ))}
            </div>
          )}
          {content.warning && (
            <div className="bg-error-container/30 rounded-xl p-4 border border-error-container flex items-start gap-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-sm text-on-surface-variant">{content.warning}</p>
            </div>
          )}
          {content.tip && (
            <div className="bg-tertiary-container/30 rounded-xl p-4 border border-tertiary-container flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary">lightbulb</span>
              <p className="text-sm text-on-surface-variant">{content.tip}</p>
            </div>
          )}
        </div>
      ) : null}
    </WizardLayout>
  );
}
