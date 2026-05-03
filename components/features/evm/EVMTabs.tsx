"use client";

import { type ReactNode } from "react";

interface EVMTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const TABS = [
  { id: "components", icon: "memory", label: "Components" },
  { id: "lifecycle", icon: "autorenew", label: "Lifecycle" },
  { id: "security", icon: "shield", label: "Security" },
  { id: "voter-journey", icon: "directions_walk", label: "Voter Journey" },
  { id: "counting", icon: "analytics", label: "Counting" },
  { id: "simulator", icon: "touch_app", label: "Try EVM" },
];

export function EVMTabs({ activeTab, onTabChange, children }: EVMTabsProps) {
  return (
    <div>
      {/* Tab Bar */}
      <div className="overflow-x-auto scrollbar-hide mb-8">
        <div className="flex gap-1 bg-surface-container-low border border-outline-variant rounded-xl p-1.5 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[40px] ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {children}
      </div>
    </div>
  );
}
