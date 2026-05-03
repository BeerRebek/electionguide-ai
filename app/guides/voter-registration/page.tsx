"use client";

import { useState } from "react";
import { WizardLayout, type WizardStep } from "@/components/features/wizards/WizardLayout";
import { LogicQuestionnaire } from "@/components/features/wizards/LogicQuestionnaire";
import { EligibilityCheck } from "@/components/features/wizards/EligibilityCheck";
import { DocumentsChecklist } from "@/components/features/wizards/DocumentsChecklist";
import { QualifyingDates } from "@/components/features/wizards/QualifyingDates";
import { ModeSelection } from "@/components/features/wizards/ModeSelection";
import { OnlineWalkthrough } from "@/components/features/wizards/OnlineWalkthrough";
import { WizardCompletion } from "@/components/features/wizards/WizardCompletion";

const STEPS: WizardStep[] = [
  { id: "form", label: "Select Form", icon: "description" },
  { id: "eligibility", label: "Eligibility Check", icon: "fact_check" },
  { id: "documents", label: "Documents Needed", icon: "folder" },
  { id: "dates", label: "Qualifying Dates", icon: "event" },
  { id: "mode", label: "Application Mode", icon: "devices" },
  { id: "walkthrough", label: "Step-by-Step Guide", icon: "menu_book" },
  { id: "completion", label: "Completion", icon: "celebration" },
];

const TIPS: Record<number, string> = {
  0: "India has 4 different voter registration forms. Selecting the right one ensures faster processing.",
  1: "You must meet ALL eligibility criteria. If you're unsure, consult your BLO (Booth Level Officer).",
  2: "Having documents ready before starting the application reduces errors and saves time.",
  3: "You can apply during any revision period, even after your qualifying date has passed.",
  4: "Online applications are processed faster and can be tracked in real-time.",
  5: "Take screenshots at each step of the NVSP portal in case you need to resume later.",
  6: "Your application typically takes 15-30 days. Track it using your reference number.",
};

export default function VoterRegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [eligibilityPassed, setEligibilityPassed] = useState(false);
  const [docChecks, setDocChecks] = useState<Record<string, boolean>>({});
  const [allDocuments, setAllDocuments] = useState(false);
  const [dob, setDob] = useState("");
  const [mode, setMode] = useState<"online" | "offline" | null>(null);

  const canGoNext = (() => {
    switch (currentStep) {
      case 0: return !!selectedForm;
      case 1: return eligibilityPassed;
      case 2: return allDocuments;
      case 3: return !!dob;
      case 4: return !!mode;
      case 5: return true;
      case 6: return false;
      default: return false;
    }
  })();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const toggleDoc = (id: string) => {
    setDocChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedSteps = STEPS.slice(0, 6).map((s) => ({ label: s.label, icon: s.icon }));

  return (
    <WizardLayout
      title="Voter Registration Guide"
      steps={STEPS.map((s, i) => ({ ...s, completed: i < currentStep }))}
      currentStep={currentStep}
      onNext={handleNext}
      onPrev={handlePrev}
      canGoNext={canGoNext}
      nextLabel={currentStep === STEPS.length - 2 ? "Complete Guide ✓" : "Continue"}
      tip={TIPS[currentStep]}
      backHref="/guides"
    >
      {currentStep === 0 && (
        <LogicQuestionnaire
          selectedForm={selectedForm}
          onSelect={setSelectedForm}
        />
      )}
      {currentStep === 1 && (
        <EligibilityCheck onEligible={() => setEligibilityPassed(true)} />
      )}
      {currentStep === 2 && (
        <DocumentsChecklist
          checked={docChecks}
          onToggle={toggleDoc}
          allDocuments={allDocuments}
          onAllDocumentsChange={setAllDocuments}
        />
      )}
      {currentStep === 3 && (
        <QualifyingDates dob={dob} onDobChange={setDob} />
      )}
      {currentStep === 4 && (
        <ModeSelection selected={mode} onSelect={setMode} />
      )}
      {currentStep === 5 && <OnlineWalkthrough />}
      {currentStep === 6 && (
        <WizardCompletion
          completedSteps={completedSteps}
          selectedForm={selectedForm || "Form 6"}
          wizardTitle="Voter Registration"
          nextHref="/booth-finder"
          nextLabel="Find Your Polling Booth"
        />
      )}
    </WizardLayout>
  );
}
