"use client";

import { useState, useEffect } from "react";

type FontSize = "small" | "normal" | "large" | "xlarge";

export function FontSizeControls() {
  const [fontSize, setFontSize] = useState<FontSize>("normal");

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
  }, [fontSize]);

  const sizes: { label: string; value: FontSize; ariaLabel: string }[] = [
    { label: "A−", value: "small", ariaLabel: "Decrease font size" },
    { label: "A", value: "normal", ariaLabel: "Normal font size" },
    { label: "A+", value: "large", ariaLabel: "Increase font size" },
  ];

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Font size controls">
      {sizes.map(({ label, value, ariaLabel }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          aria-label={ariaLabel}
          aria-pressed={fontSize === value}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors
            ${fontSize === value
              ? "bg-primary-container text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
