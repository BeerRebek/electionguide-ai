"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "identify", label: "Identify the Violation", icon: "search" },
  { id: "evidence", label: "Gather Evidence", icon: "photo_camera" },
  { id: "channels", label: "Choose Your Channel", icon: "alt_route" },
  { id: "file", label: "File the Complaint", icon: "send" },
  { id: "track", label: "Track & Follow Up", icon: "track_changes" },
  { id: "done", label: "Done!", icon: "celebration" },
];

const CONTENT = [
  {
    title: "Identify the Type of Violation",
    content: "Election violations can be of different types. Identifying the correct type helps route your complaint to the right authority.",
    items: [
      { icon: "campaign", label: "MCC Violation", note: "Campaign after silence period, hate speech, religious appeals" },
      { icon: "currency_rupee", label: "Bribery / Vote Buying", note: "Cash distribution, gifts, liquor distribution" },
      { icon: "how_to_vote", label: "Booth Capturing", note: "Impersonation, forced voting, booth tampering" },
      { icon: "ballot", label: "EVM Tampering", note: "Any suspicious activity around voting machines" },
      { icon: "no_photography", label: "Intimidation", note: "Threats to voters, preventing people from voting" },
    ],
  },
  {
    title: "Gather Evidence",
    content: "Strong evidence significantly increases the chances of your complaint being acted upon.",
    items: [
      { icon: "photo_camera", label: "Photos / Videos", note: "Date, time, and location metadata preserved" },
      { icon: "receipt", label: "Documentary proof", note: "Pamphlets, announcements, money receipts" },
      { icon: "group", label: "Witness details", note: "Names and contact numbers of witnesses" },
      { icon: "location_on", label: "Location specifics", note: "Exact address, polling booth number" },
    ],
    warning: "Do NOT put yourself in danger to gather evidence. Your safety is paramount.",
  },
  {
    title: "Choose Your Complaint Channel",
    items: [
      { icon: "phone", label: "National Voter Helpline: 1950", note: "Call or SMS. Available 24/7 during elections" },
      { icon: "phone_android", label: "cVIGIL App", note: "ECI's official app. Upload photo/video. Gets resolved in 100 minutes" },
      { icon: "computer", label: "ECI Website", note: "eci.gov.in → Grievances → Submit complaint" },
      { icon: "location_city", label: "District Election Officer", note: "Visit in person with written complaint" },
      { icon: "gavel", label: "Police (FIR)", note: "For criminal violations like booth capturing, bribery" },
    ],
  },
  {
    title: "Filing Your Complaint",
    content: "Use the cVIGIL app for fastest resolution — the ECI promises action within 100 minutes.",
    steps: [
      "Download cVIGIL from Play Store / App Store",
      "Allow location access (mandatory for geo-tagging)",
      "Select violation category from the list",
      "Upload photo or video of the violation",
      "Add a text description with all relevant details",
      "Submit — you'll get a unique ID for tracking",
    ],
    tip: "For non-app complaints, always get a written acknowledgment with a reference number.",
  },
  {
    title: "Track & Follow Up",
    steps: [
      "Use the reference/complaint number to track status on cVIGIL or ECI portal",
      "If no action within 24 hours, escalate to State Chief Electoral Officer",
      "You can also contact the ECI directly at complaints@eci.gov.in",
      "For serious violations, approach the High Court under Election Petition post-election",
    ],
    tip: "Keep copies of all correspondence. You may need them if you escalate the complaint.",
  },
];

export default function FileComplaintWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const content = CONTENT[currentStep] || null;
  const completedSteps = STEPS.slice(0, 5).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="Filing an Election Complaint"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
      canGoNext={currentStep < STEPS.length - 1}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip="The cVIGIL app is the fastest way to report violations — ECI guarantees 100-minute resolution."
      backHref="/guides"
    >
      {currentStep === STEPS.length - 1 ? (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm="Complaint Procedure"
          wizardTitle="Filing an Election Complaint"
          nextHref="/quiz"
          nextLabel="Take a Quiz on Election Rules"
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
