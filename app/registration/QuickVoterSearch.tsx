"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuickVoterSearch() {
  const [epic, setEpic] = useState("");
  const router = useRouter();

  const go = () => {
    if (epic.trim()) router.push(`/registration/status?epic=${encodeURIComponent(epic.trim())}`);
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">search</span>
        Quick Voter ID Search
      </h3>
      <div className="flex gap-3">
        <input
          type="text"
          value={epic}
          onChange={(e) => setEpic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Enter your EPIC (Voter ID) number..."
          className="flex-1 bg-surface border border-outline-variant rounded-lg py-3 px-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={go}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity min-h-[48px]"
        >
          Verify
        </button>
      </div>
      <p className="text-xs text-on-surface-variant mt-2">
        Your EPIC number is printed on your Voter ID card (e.g., <button onClick={() => setEpic("NDX1234567")} className="text-primary underline">NDX1234567</button>)
      </p>
    </section>
  );
}
