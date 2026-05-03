"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FinancialCharts } from "./FinancialCharts";

type Tab = "overview" | "criminal" | "financial" | "education" | "track" | "affidavit";

const TABS: { key: Tab; label: string; icon?: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "criminal", label: "Criminal Cases", icon: "gavel" },
  { key: "financial", label: "Financial Profile" },
  { key: "education", label: "Education" },
  { key: "track", label: "Track Record" },
  { key: "affidavit", label: "Affidavit" },
];

interface CandidateData {
  id: string;
  name: string;
  photo_url?: string;
  age?: number;
  education?: string;
  criminal_cases?: number;
  assets_declared?: number;
  liabilities?: number;
  manifesto_summary?: string;
  social_links?: Record<string, string>;
  parties?: { name: string; abbreviation: string; color: string } | null;
  constituencies?: { name: string; state: string } | null;
}

function formatAssets(val?: number) {
  if (!val) return "₹0";
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)} Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();

    async function fetchCandidate() {
      setLoading(true);
      const { data, error } = await supabase
        .from("candidates")
        .select(
          `id, name, photo_url, age, education, criminal_cases,
           assets_declared, liabilities, manifesto_summary, social_links,
           parties(name, abbreviation, color),
           constituencies(name, state)`
        )
        .eq("id", id)
        .single();

      if (error) {
        setError("Candidate not found.");
      } else {
        setCandidate(data as unknown as CandidateData);
      }
      setLoading(false);
    }

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-surface-variant rounded w-48" />
          <div className="bg-surface-container-lowest rounded-2xl p-10 flex gap-8">
            <div className="w-40 h-40 rounded-full bg-surface-variant flex-shrink-0" />
            <div className="flex-1 space-y-4 pt-4">
              <div className="h-8 bg-surface-variant rounded w-60" />
              <div className="h-5 bg-surface-variant rounded w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12 text-center py-24">
        <span className="material-symbols-outlined text-6xl mb-4 block opacity-40 text-on-surface-variant">person_off</span>
        <p className="text-xl font-medium text-on-surface">Candidate not found</p>
        <Link href="/candidates" className="mt-4 inline-flex items-center gap-1 text-primary hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Candidates
        </Link>
      </div>
    );
  }

  const isClean = (candidate.criminal_cases ?? 0) === 0;
  const partyColor = (candidate.parties as any)?.color ?? "#6366f1";
  const partyName = (candidate.parties as any)?.name ?? "Independent";
  const partyAbbr = (candidate.parties as any)?.abbreviation;
  const constituencyName = (candidate.constituencies as any)?.name ?? "";
  const constituencyState = (candidate.constituencies as any)?.state ?? "";

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-6 lg:mb-8">
        <Link
          href="/candidates"
          className="hover:text-primary flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Candidates
        </Link>
        <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
        <span className="text-on-surface">{constituencyName} Constituency</span>
      </div>

      {/* Hero Section */}
      <section className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 lg:p-10 mb-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          {/* Candidate Identity */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-surface-variant flex-shrink-0 relative">
              {candidate.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                  src={candidate.photo_url}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                  {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              {isClean && (
                <div className="absolute bottom-2 right-2 bg-on-tertiary-container text-on-tertiary rounded-full p-1 border-2 border-white shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-bold tracking-tight text-on-background leading-tight">
                  {candidate.name}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-on-surface-variant text-base">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: partyColor }}
                  />
                  <span className="font-medium">
                    {partyName}{partyAbbr ? ` (${partyAbbr})` : ""}
                  </span>
                </div>
                <span className="hidden sm:block text-outline">•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {constituencyName}{constituencyState ? `, ${constituencyState}` : ""}
                </div>
                {candidate.age && (
                  <>
                    <span className="hidden sm:block text-outline">•</span>
                    <span>Age {candidate.age}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full md:w-auto gap-3">
            <Link
              href={`/candidates/compare?ids=${candidate.id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface text-primary border border-primary px-6 py-3 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors min-h-[48px]"
            >
              <span className="material-symbols-outlined">compare_arrows</span>
              Compare
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: candidate.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-colors min-h-[48px]"
            >
              <span className="material-symbols-outlined">share</span>
              Share Profile
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-outline-variant overflow-x-auto">
        <nav className="flex gap-8 min-w-max px-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-sm font-medium py-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              {tab.icon && (
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={
                    activeTab === tab.key
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "gavel", label: "Pending Cases", value: String(candidate.criminal_cases ?? 0) },
              { icon: "currency_rupee", label: "Declared Assets", value: formatAssets(candidate.assets_declared) },
              { icon: "account_balance_wallet", label: "Liabilities", value: formatAssets(candidate.liabilities) },
              { icon: "school", label: "Education", value: candidate.education ?? "—" },
            ].map((s) => (
              <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex items-center gap-5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container">{s.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface break-all">{s.value}</p>
                  <p className="text-sm text-on-surface-variant">{s.label}</p>
                </div>
              </div>
            ))}
            {candidate.manifesto_summary && (
              <div className="md:col-span-2 bg-surface-container-low border border-primary-fixed-dim rounded-xl p-5 flex gap-4 items-start">
                <div className="bg-primary-container p-2 rounded-full flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container">smart_toy</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">AI Profile Summary</p>
                  <p className="text-sm text-on-surface-variant">{candidate.manifesto_summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CRIMINAL ── */}
        {activeTab === "criminal" && (
          <div className="space-y-6">
            <div className="bg-surface-container-low border border-primary-fixed-dim rounded-xl p-4 flex gap-4 items-start">
              <div className="bg-primary-container text-on-primary-container p-2 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                {(candidate.criminal_cases ?? 0) === 0
                  ? `${candidate.name} has a clean criminal record with no declared cases.`
                  : `This candidate has declared ${candidate.criminal_cases} pending case${(candidate.criminal_cases ?? 0) > 1 ? "s" : ""}.`}
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm text-center">
              <p className="text-sm text-on-surface-variant mb-2">Total Declared Cases</p>
              <p className={`text-6xl font-bold ${(candidate.criminal_cases ?? 0) > 0 ? "text-error" : "text-tertiary"}`}>
                {candidate.criminal_cases ?? 0}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {(candidate.criminal_cases ?? 0) === 0 ? "Clean Record" : "Active / Pending"}
              </p>
            </div>
          </div>
        )}

        {/* ── FINANCIAL ── */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            <FinancialCharts
              assets={candidate.assets_declared ?? 0}
              liabilities={candidate.liabilities ?? 0}
            />
          </div>
        )}

        {/* ── EDUCATION ── */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-semibold text-on-surface">Educational Qualifications</h3>
              </div>
              <div className="p-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container">school</span>
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">{candidate.education ?? "Not declared"}</p>
                    <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full mt-2 inline-block">As per ECI Affidavit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRACK RECORD ── */}
        {activeTab === "track" && (
          <div className="space-y-6">
            <div className="bg-surface-container-low border border-primary-fixed-dim rounded-xl p-5 flex gap-4 items-start">
              <div className="bg-primary-container p-2 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-on-primary-container">smart_toy</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                Track record data is sourced from official legislative records. Some data may not be available for all candidates.
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm text-center text-on-surface-variant py-16">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">history</span>
              <p>Track record data not yet available for {candidate.name}.</p>
            </div>
          </div>
        )}

        {/* ── AFFIDAVIT ── */}
        {activeTab === "affidavit" && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-outline-variant flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-on-surface">Nomination Affidavit — General Election 2024</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Form 26 · Official Submission</p>
                </div>
              </div>
              <div className="divide-y divide-outline-variant">
                {[
                  { section: "Criminal Background", status: `${candidate.criminal_cases ?? 0} case${(candidate.criminal_cases ?? 0) !== 1 ? "s" : ""} declared`, flag: (candidate.criminal_cases ?? 0) > 0 },
                  { section: "Financial Assets", status: formatAssets(candidate.assets_declared) + " declared", flag: false },
                  { section: "Liabilities", status: formatAssets(candidate.liabilities) + " declared", flag: false },
                  { section: "Education", status: candidate.education ? "Declared" : "Not Provided", flag: !candidate.education },
                ].map((r) => (
                  <div key={r.section} className="flex items-center justify-between px-6 py-4">
                    <span className="text-sm text-on-surface">{r.section}</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${r.flag ? "bg-error-container text-on-error-container" : "bg-tertiary-container text-on-tertiary-container"}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Transparency Footer */}
      <footer className="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full">
            <span
              className="material-symbols-outlined text-[16px] text-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-medium text-on-surface">Data verified against ECI Affidavit</span>
          </div>
          <span>Powered by ADR (Association for Democratic Reforms)</span>
        </div>
      </footer>
    </div>
  );
}
