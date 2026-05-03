"use client";

import { SECURITY_FEATURES } from "@/lib/data/evm-lifecycle";

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  physical: { label: "Physical", icon: "lock", color: "text-primary" },
  digital: { label: "Digital", icon: "memory", color: "text-tertiary" },
  procedural: { label: "Procedural", icon: "checklist", color: "text-secondary" },
};

export function SecurityFeatures() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-on-surface mb-2">Security Features</h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Multi-layered security across physical, digital, and procedural dimensions ensures election integrity.
      </p>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[16px] ${val.color}`}>{val.icon}</span>
            <span className="text-xs font-medium text-on-surface-variant">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECURITY_FEATURES.map((feat) => {
          const cat = CATEGORY_LABELS[feat.category];
          return (
            <div
              key={feat.title}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">{feat.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-on-surface">{feat.title}</h3>
                    <span className={`text-[10px] font-medium ${cat.color} uppercase tracking-wider`}>
                      {cat.label}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
