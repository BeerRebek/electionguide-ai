"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "eligibility", label: "Eligibility to Contest", icon: "how_to_vote" },
  { id: "nomination", label: "Nomination Process", icon: "edit_note" },
  { id: "affidavit", label: "Form 26 Affidavit", icon: "article" },
  { id: "deposit", label: "Security Deposit", icon: "payments" },
  { id: "campaign", label: "Campaign Rules", icon: "campaign" },
  { id: "mcc", label: "Model Code of Conduct", icon: "gavel" },
  { id: "expenses", label: "Election Expenses", icon: "account_balance_wallet" },
  { id: "results", label: "Post-Result Process", icon: "bar_chart" },
  { id: "responsibilities", label: "Responsibilities", icon: "groups" },
  { id: "done", label: "Done!", icon: "celebration" },
];

const CONTENT = [
  {
    title: "Are You Eligible to Contest?",
    items: [
      { icon: "person", label: "Indian Citizen", note: "Must be an Indian citizen" },
      { icon: "cake", label: "Age: 25+ (LS/Assembly), 30+ (RS/Council)", note: "Minimum age varies by house" },
      { icon: "how_to_vote", label: "Registered Voter", note: "Must be enrolled in an electoral roll" },
      { icon: "gavel", label: "Not disqualified", note: "No conviction for 2+ years under relevant laws" },
      { icon: "psychology", label: "Sound mind", note: "Not declared of unsound mind by court" },
    ],
  },
  {
    title: "The Nomination Process",
    content: "Nominations are filed with the Returning Officer (RO) during a specified period announced with the election schedule.",
    steps: [
      "Obtain nomination form from Returning Officer or download from ECI website",
      "Fill Form 2B (for general elections) with proposer signatures",
      "Submit nomination papers to RO during specified window (10 AM – 3 PM)",
      "Attend scrutiny of nominations on specified date",
      "Withdraw candidature if desired (by 3 PM on withdrawal day)",
    ],
  },
  {
    title: "Form 26 — Mandatory Affidavit",
    content: "Every candidate must file Form 26 declaring criminal antecedents, assets, liabilities, and educational qualifications.",
    items: [
      { icon: "gavel", label: "Criminal cases", note: "All pending cases with FIR number, court, section" },
      { icon: "account_balance", label: "Assets", note: "Self and spouse/dependents movable + immovable" },
      { icon: "credit_card", label: "Liabilities", note: "Loans and dues owed to public financial institutions" },
      { icon: "school", label: "Education", note: "Highest qualification and institution name" },
    ],
    warning: "False declarations in Form 26 are a criminal offense under IPC Section 125A.",
  },
  {
    title: "Security Deposit",
    content: "Candidates must pay a refundable security deposit at the time of nomination.",
    items: [
      { icon: "currency_rupee", label: "Lok Sabha: ₹25,000", note: "₹12,500 for SC/ST candidates" },
      { icon: "currency_rupee", label: "State Assembly: ₹10,000", note: "₹5,000 for SC/ST candidates" },
      { icon: "check_circle", label: "Refunded if", note: "Candidate gets more than 1/6th of total valid votes" },
      { icon: "cancel", label: "Forfeited if", note: "Less than 1/6th valid votes polled" },
    ],
  },
  {
    title: "Campaign Rules & Restrictions",
    items: [
      { icon: "schedule", label: "Campaign period", note: "Ends 48 hours before polling (silence period)" },
      { icon: "no_photography", label: "No paid content without disclosure", note: "All ads must disclose spender" },
      { icon: "local_police", label: "No vote-buying", note: "Distributing cash/gifts is a criminal offense" },
      { icon: "church", label: "No religion-based appeals", note: "Appealing on religion, caste is punishable" },
      { icon: "mic", label: "Permission for rallies", note: "Police permission required for public meetings" },
    ],
  },
  {
    title: "Model Code of Conduct",
    content: "The MCC comes into effect from the date of election announcement and governs the conduct of parties and candidates.",
    steps: [
      "No abuse of government machinery for campaign purposes",
      "No use of government vehicles, aircraft for campaign",
      "Polling booths can only be set up by the Election Commission",
      "No ministers to make government announcements that benefit a particular area",
      "All party manifestos must be moderated",
    ],
  },
  {
    title: "Election Expenditure Limits",
    items: [
      { icon: "account_balance_wallet", label: "Lok Sabha: ₹95 lakh", note: "Per candidate (smaller states: ₹75 lakh)" },
      { icon: "account_balance_wallet", label: "State Assembly: ₹40 lakh", note: "Per candidate (smaller states: ₹28 lakh)" },
      { icon: "receipt_long", label: "All expenses must be logged", note: "In a register within 3 days of expenditure" },
      { icon: "fact_check", label: "Submit accounts within 30 days", note: "After declaration of results to District Officer" },
    ],
    warning: "Exceeding the expenditure limit is a ground for disqualification from membership for 3 years.",
  },
  {
    title: "Post-Result Process",
    steps: [
      "Counting day: Attend counting center with valid ID",
      "If victorious, collect election certificate from Returning Officer",
      "File election expenditure account within 30 days",
      "Take oath/affirmation before you can sit and vote in the House",
      "Submit declaration of assets annually as an MP/MLA",
    ],
  },
  {
    title: "Responsibilities as an Elected Representative",
    items: [
      { icon: "how_to_vote", label: "Attend sessions regularly", note: "Persistent absence can lead to disqualification" },
      { icon: "question_answer", label: "Raise constituents&apos; issues", note: "Ask questions, move motions" },
      { icon: "fact_check", label: "Vote on bills and resolutions", note: "Your vote shapes national/state policy" },
      { icon: "account_balance", label: "Annual asset disclosure", note: "File annual property statement" },
    ],
  },
];

export default function BecomeCandidateWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const content = CONTENT[currentStep] || null;
  const completedSteps = STEPS.slice(0, 9).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="Becoming a Candidate"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
      canGoNext={currentStep < STEPS.length - 1}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip="Study the Representation of the People Act, 1951 for complete legal requirements."
      backHref="/guides"
    >
      {currentStep === STEPS.length - 1 ? (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm="Candidature Process"
          wizardTitle="Becoming a Candidate"
          nextHref="/candidates"
          nextLabel="Research Other Candidates"
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
            <div className="bg-error-container/30 rounded-xl p-4 border border-error-container flex items-start gap-3 mt-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-sm text-on-surface-variant">{content.warning}</p>
            </div>
          )}
        </div>
      ) : null}
    </WizardLayout>
  );
}
