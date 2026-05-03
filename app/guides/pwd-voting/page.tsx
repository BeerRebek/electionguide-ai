"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "overview", label: "PwD Voter Rights", icon: "accessibility_new" },
  { id: "facilities", label: "Booth Facilities", icon: "accessible_forward" },
  { id: "companions", label: "Companion Assistance", icon: "group" },
  { id: "postal", label: "Postal Ballot", icon: "markunread_mailbox" },
  { id: "home-voting", label: "Home Voting (85+)", icon: "home" },
  { id: "saksham", label: "SAKSHAM App", icon: "smartphone" },
  { id: "done", label: "Done!", icon: "celebration" },
];

const CONTENT = [
  {
    title: "Rights of Persons with Disabilities (PwD) Voters",
    content: "The Election Commission of India (ECI) ensures that every PwD voter can exercise their right to vote with dignity, accessibility, and independence.",
    items: [
      { icon: "how_to_vote", label: "Right to vote independently", note: "ECI provides assistive devices at booths" },
      { icon: "accessible_forward", label: "Priority queuing", note: "PwD voters can skip general queues" },
      { icon: "support_agent", label: "Companion assistance", note: "Right to bring a trusted companion" },
      { icon: "markunread_mailbox", label: "Postal ballot option", note: "Vote from home via postal ballot" },
      { icon: "directions_car", label: "Free transportation", note: "ECI arranges transport to polling booths" },
    ],
  },
  {
    title: "Accessibility Facilities at Polling Booths",
    items: [
      { icon: "accessible_forward", label: "Ramps & Wheelchair access", note: "All booths must have barrier-free access" },
      { icon: "braille", label: "Braille ballots", note: "Braille slips available for visually impaired" },
      { icon: "hearing", label: "Sign language support", note: "Trained staff at model polling stations" },
      { icon: "chair", label: "Seating arrangements", note: "Dedicated seating at the queue for PwD voters" },
      { icon: "lightbulb", label: "Magnifying lens", note: "Available at EVM for voters with partial sight" },
      { icon: "emoji_objects", label: "Voting compartment adapted", note: "Lowered height for wheelchair users at model booths" },
    ],
  },
  {
    title: "Companion Assistance While Voting",
    content: "PwD voters may bring a companion of their choice into the voting compartment to assist them.",
    items: [
      { icon: "person", label: "One companion allowed", note: "Must be above 18 years of age" },
      { icon: "badge", label: "Companion must sign Form 14A", note: "Declaration that they will keep vote secret" },
      { icon: "block", label: "Restrictions on companion", note: "Companion cannot be a candidate or election agent" },
      { icon: "repeat", label: "Companion can assist multiple voters", note: "But only if they are from the same family" },
    ],
    tip: "If you cannot read, are blind, or have any motor disability, you are automatically entitled to companion assistance.",
  },
  {
    title: "Voting via Postal Ballot",
    content: "PwD voters (disability ≥40%) and senior citizens (85+) can opt for postal ballot voting from home.",
    steps: [
      "Inform your local BLO (Booth Level Officer) or ERO (Electoral Registration Officer) of your wish to use postal ballot",
      "Fill Form 12D — application for postal ballot",
      "Submit the form at least 10 days before polling day",
      "You will receive a ballot paper at home by post or via a polling team",
      "Mark your vote and seal in the provided envelope",
      "Hand it to the postal ballot collection team",
    ],
    tip: "Postal ballot is only valid if received by the Returning Officer before counting. Ensure timely submission.",
  },
  {
    title: "Home Voting for 85+ and PwD Voters",
    content: "ECI launched home voting in 2019 for senior citizens (85+) and PwD voters with 40%+ disability who opt in.",
    steps: [
      "Register your intent at least 5 days before the poll date",
      "Contact your local ERO or BLO (their number is on voters.eci.gov.in)",
      "A polling team will visit your home on a designated date",
      "Vote in the presence of the team and a micro-observer",
      "The ballot is sealed and taken back for secure counting",
    ],
    tip: "This service is available in most states. Check your state election commission website for confirmation.",
  },
  {
    title: "SAKSHAM — The ECI App for PwD Voters",
    content: "SAKSHAM (Systematic Accessibility & Knowledge for the Specially-Abled and Marginalized) is ECI's dedicated app for PwD voters.",
    items: [
      { icon: "smartphone", label: "Available on Android & iOS", note: "Search 'SAKSHAM ECI' on Play Store / App Store" },
      { icon: "accessible_forward", label: "Find accessible booths near you", note: "Filter by ramp, wheelchair, Braille support" },
      { icon: "directions_car", label: "Request transport assistance", note: "Arrange a pickup to the polling booth" },
      { icon: "notifications_active", label: "Election notifications", note: "Get reminders for your polling date and time" },
      { icon: "report_problem", label: "Report accessibility issues", note: "Directly flag problems at your booth" },
    ],
  },
];

export default function PwdVotingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const content = CONTENT[currentStep] || null;
  const completedSteps = STEPS.slice(0, 6).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="PwD Voter Guide — Know Your Rights"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
      onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
      canGoNext={currentStep < STEPS.length - 1}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip="PwD voters are entitled to priority queuing, companion assistance, and postal ballot options."
      backHref="/guides"
    >
      {currentStep === STEPS.length - 1 ? (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm="PwD Accessibility Guide"
          wizardTitle="PwD Voter Guide"
          nextHref="/guides/voting-day"
          nextLabel="Voting Day Checklist"
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
