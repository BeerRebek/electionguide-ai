"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Mock data — in a real app this would come from Supabase
const MOCK_DB: Record<string, { name: string; constituency: string; boothNo: string; status: string; lastUpdated: string }> = {
  "NDX1234567": { name: "Rahul Sharma", constituency: "Pune - Ward 14", boothNo: "247", status: "Active", lastUpdated: "2024-01-15" },
  "MHB9876543": { name: "Priya Patel", constituency: "Mumbai South - Ward 3", boothNo: "102", status: "Active", lastUpdated: "2024-02-20" },
  "DL0045678": { name: "Amit Singh", constituency: "New Delhi - Sarojini Nagar", boothNo: "58", status: "Under Verification", lastUpdated: "2024-03-01" },
  "REG12345678": { name: "Application Pending", constituency: "—", boothNo: "—", status: "Pending", lastUpdated: "2024-04-10" },
};

export default function StatusClient() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("epic") ?? "");
  const [result, setResult] = useState<typeof MOCK_DB[string] | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  const search = (q = query) => {
    const key = q.trim().toUpperCase();
    setResult(MOCK_DB[key] ?? null);
    setSearched(true);
  };

  // Auto-search if coming from hub with ?epic=
  useEffect(() => {
    const epic = params.get("epic");
    if (epic) { setQuery(epic); search(epic); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColor = (s?: string) => {
    if (!s) return "";
    if (s === "Active") return "text-primary bg-primary-container";
    if (s === "Pending") return "text-[color:var(--md-sys-color-tertiary)] bg-[color:var(--md-sys-color-tertiary-container)]";
    return "text-secondary bg-secondary-container";
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <label className="text-sm font-medium text-on-surface block mb-1.5">
          Enter Your Voter ID (EPIC) or Application Reference Number
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="e.g. NDX1234567 or REG12345678"
            className="flex-1 bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => search()}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Check
          </button>
        </div>
        <p className="text-xs text-on-surface-variant mt-2">
          Try:{" "}
          {["NDX1234567","MHB9876543","REG12345678"].map((id) => (
            <span key={id}>
              <button onClick={() => { setQuery(id); search(id); }} className="text-primary underline">{id}</button>
              {id !== "REG12345678" ? ", " : ""}
            </span>
          ))}
        </p>
      </div>

      {/* Results */}
      {searched && result === null && (
        <div className="rounded-xl border border-error-container bg-error-container/20 p-5 flex gap-3">
          <span className="material-symbols-outlined text-error flex-shrink-0">error_outline</span>
          <div>
            <p className="font-semibold text-on-error-container mb-1">No Record Found</p>
            <p className="text-sm text-on-surface-variant">
              No voter record found for <strong>{query.trim()}</strong>. Please check the ID and try again, or{" "}
              <Link href="/registration/new" className="text-primary underline">apply for fresh registration</Link>.
            </p>
          </div>
        </div>
      )}

      {searched && result && (
        <div className="rounded-xl border border-outline-variant p-5 bg-surface-container-lowest shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xl font-bold text-on-surface">{result.name}</p>
              <p className="text-sm text-on-surface-variant mt-0.5">{result.constituency}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(result.status)}`}>
              {result.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
            <div>
              <p className="text-xs text-on-surface-variant">Polling Booth No.</p>
              <p className="text-lg font-bold text-on-surface">{result.boothNo}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Last Updated</p>
              <p className="text-base font-semibold text-on-surface">{result.lastUpdated}</p>
            </div>
          </div>
          {result.status === "Active" && (
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/booth-finder" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Find My Booth
              </Link>
              <Link href="/registration/correction" className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Correct Details
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">info</span>
        <p className="text-sm text-on-surface-variant">
          Your Voter ID (EPIC) is printed on your voter ID card. Application reference numbers (starting with REG) are issued when you submit a new registration form.
        </p>
      </div>
    </div>
  );
}
