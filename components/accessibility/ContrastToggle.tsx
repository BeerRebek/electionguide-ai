"use client";

import { useState, useEffect } from "react";

export function ContrastToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-contrast",
      highContrast ? "high" : "normal"
    );
  }, [highContrast]);

  return (
    <button
      onClick={() => setHighContrast(!highContrast)}
      aria-label={highContrast ? "Switch to normal contrast" : "Switch to high contrast"}
      aria-pressed={highContrast}
      className="p-1 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary-container"
      title={highContrast ? "Normal contrast" : "High contrast"}
    >
      <span className="material-symbols-outlined text-xl">contrast</span>
    </button>
  );
}
