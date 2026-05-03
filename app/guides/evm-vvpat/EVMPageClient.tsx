"use client";

import { useState } from "react";
import { EVMHero } from "@/components/features/evm/EVMHero";
import { ComponentExplorer } from "@/components/features/evm/ComponentExplorer";
import { LifecycleStages } from "@/components/features/evm/LifecycleStages";
import { SecurityFeatures } from "@/components/features/evm/SecurityFeatures";
import { VoterJourney } from "@/components/features/evm/VoterJourney";
import { CountingVisualization } from "@/components/features/evm/CountingVisualization";
import { EVMSimulator } from "@/components/features/evm/EVMSimulator";
import Link from "next/link";

const SECTIONS = [
  { id: "components", icon: "settings_input_component", label: "Components" },
  { id: "lifecycle", icon: "history_edu", label: "Lifecycle" },
  { id: "security", icon: "verified_user", label: "Security" },
  { id: "voter-journey", icon: "person_check", label: "Voter Experience" },
  { id: "counting", icon: "analytics", label: "Counting Process" },
  { id: "simulator", icon: "touch_app", label: "Try EVM" },
];

export function EVMPageClient() {
  const [activeSection, setActiveSection] = useState("components");

  const renderContent = () => {
    switch (activeSection) {
      case "components": return <ComponentExplorer />;
      case "lifecycle": return <LifecycleStages />;
      case "security": return <SecurityFeatures />;
      case "voter-journey": return <VoterJourney />;
      case "counting": return <CountingVisualization />;
      case "simulator": return <EVMSimulator />;
      default: return <ComponentExplorer />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)] -mx-6 -my-8 md:-my-12">
      {/* Side Navigation — Desktop */}
      <nav className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-lowest py-6 flex-shrink-0 sticky top-20 self-start h-[calc(100vh-80px)]">
        <div className="px-6 mb-6">
          <h2 className="font-bold text-on-surface text-base">EVM & VVPAT Guide</h2>
          <p className="text-xs text-outline mt-0.5">Verified Civic Information</p>
        </div>

        <ul className="flex-1 space-y-1">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-6 py-3 gap-3 text-sm transition-all ${
                  activeSection === section.id
                    ? "bg-primary-fixed/30 text-primary font-semibold border-r-4 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:translate-x-1"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={activeSection === section.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {section.icon}
                </span>
                <span>{section.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-6 mt-auto">
          <Link
            href="/chat?q=How%20does%20EVM%20security%20work"
            className="w-full bg-primary text-on-primary text-sm font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-6"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            Ask AI Assistant
          </Link>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-outline-variant bg-surface sticky top-16 z-30">
        <div className="flex gap-1 p-2 min-w-max">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[900px] mx-auto p-4 md:p-8 space-y-12">
        <EVMHero
          activeSection={activeSection}
          onTrySimulator={() => {
            setActiveSection("simulator");
            // Scroll to content after state update
            setTimeout(() => {
              const el = document.getElementById("evm-simulator-content");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
        <div id="evm-simulator-content">
          {renderContent()}
        </div>

        {/* AI CTA */}
        <section className="bg-surface-container-low border border-outline-variant rounded-xl p-8 text-center">
          <span
            className="material-symbols-outlined text-5xl text-primary mb-4 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            smart_toy
          </span>
          <h2 className="text-2xl font-semibold text-on-surface mb-2">Still have questions?</h2>
          <p className="text-on-surface-variant mb-6 max-w-lg mx-auto">
            Ask our AI assistant anything about EVMs, VVPATs, election security, or the voting process.
          </p>
          <Link
            href="/chat?q=How%20does%20EVM%20security%20work"
            className="bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Ask AI About EVM Security
          </Link>
        </section>
      </div>
    </div>
  );
}
