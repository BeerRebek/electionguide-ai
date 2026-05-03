"use client";

import { useState } from "react";
import Link from "next/link";

// ── Mock Data ──────────────────────────────────────────────────

const ALL_CANDIDATES = [
  {
    id: "c1",
    name: "Rajesh Patil",
    party: "NCP",
    partyColor: "#00B050",
    constituency: "Pune South",
    photo: "https://ui-avatars.com/api/?name=Rajesh+Patil&background=00B050&color=fff&size=200",
    age: 52,
    education: "MBA — Finance",
    criminal_cases: 4,
    serious_cases: 2,
    assets: "₹4.2 Cr",
    assets_raw: 42000000,
    liabilities: "₹68 L",
    net_worth: "₹3.52 Cr",
    attendance: 78,
    questions_asked: 142,
    terms: 2,
    wins: 2,
    manifesto: ["Urban infrastructure", "24/7 water supply", "Women safety"],
  },
  {
    id: "c2",
    name: "Priya Sharma",
    party: "BJP",
    partyColor: "#FF6B00",
    constituency: "Pune South",
    photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6B00&color=fff&size=200",
    age: 44,
    education: "LLB, Mumbai University",
    criminal_cases: 0,
    serious_cases: 0,
    assets: "₹2.85 Cr",
    assets_raw: 28500000,
    liabilities: "₹32 L",
    net_worth: "₹2.53 Cr",
    attendance: 0,
    questions_asked: 0,
    terms: 0,
    wins: 0,
    manifesto: ["Women entrepreneurship", "Road infrastructure", "Skill development"],
  },
  {
    id: "c3",
    name: "Arjun Mehta",
    party: "INC",
    partyColor: "#007BFF",
    constituency: "Pune South",
    photo: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=007BFF&color=fff&size=200",
    age: 38,
    education: "MBA, IIM Ahmedabad",
    criminal_cases: 1,
    serious_cases: 0,
    assets: "₹1.82 Cr",
    assets_raw: 18200000,
    liabilities: "₹50 L",
    net_worth: "₹1.32 Cr",
    attendance: 0,
    questions_asked: 0,
    terms: 0,
    wins: 0,
    manifesto: ["Digital governance", "Startup ecosystem", "Smart city"],
  },
  {
    id: "c4",
    name: "Sunita Desai",
    party: "AAP",
    partyColor: "#0080FF",
    constituency: "Kasba Peth",
    photo: "https://ui-avatars.com/api/?name=Sunita+Desai&background=0080FF&color=fff&size=200",
    age: 49,
    education: "M.Sc. Environmental Science",
    criminal_cases: 0,
    serious_cases: 0,
    assets: "₹98 L",
    assets_raw: 9800000,
    liabilities: "₹15 L",
    net_worth: "₹83 L",
    attendance: 0,
    questions_asked: 0,
    terms: 0,
    wins: 0,
    manifesto: ["Clean air & river", "Free quality education", "Women safety"],
  },
];

// ── Comparison Metric Row ──────────────────────────────────────

function MetricRow({
  label,
  values,
  icon,
  highlight,
}: {
  label: string;
  icon: string;
  values: { display: string; raw?: number; flag?: boolean; good?: boolean }[];
  highlight?: "lowest" | "highest" | "none";
}) {
  let bestIdx = -1;
  if (highlight === "lowest" && values.every((v) => v.raw !== undefined)) {
    const min = Math.min(...values.map((v) => v.raw!));
    bestIdx = values.findIndex((v) => v.raw === min);
  } else if (highlight === "highest" && values.every((v) => v.raw !== undefined)) {
    const max = Math.max(...values.map((v) => v.raw!));
    bestIdx = values.findIndex((v) => v.raw === max);
  }

  return (
    <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${values.length}, 1fr)` }}>
      {/* Label cell */}
      <div className="flex items-center gap-2 py-4 px-4 border-b border-r border-outline-variant bg-surface-container-lowest">
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
        <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      </div>
      {/* Value cells */}
      {values.map((v, i) => (
        <div
          key={i}
          className={`py-4 px-6 border-b border-r last:border-r-0 border-outline-variant text-center ${
            i === bestIdx ? "bg-tertiary-container/30" : "bg-surface-container-lowest"
          }`}
        >
          <span
            className={`text-sm font-semibold ${
              v.flag
                ? "text-error"
                : v.good
                ? "text-tertiary"
                : i === bestIdx
                ? "text-primary"
                : "text-on-surface"
            }`}
          >
            {v.display}
          </span>
          {i === bestIdx && highlight !== "none" && (
            <span className="material-symbols-outlined text-primary text-[14px] ml-1 align-middle">
              verified
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function CandidateCompare() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["c1", "c2"]);
  const [showSelector, setShowSelector] = useState<number | null>(null);

  const selected = selectedIds.map((id) => ALL_CANDIDATES.find((c) => c.id === id)!).filter(Boolean);

  function selectCandidate(slot: number, id: string) {
    const next = [...selectedIds];
    next[slot] = id;
    setSelectedIds(next);
    setShowSelector(null);
  }

  function addSlot() {
    if (selectedIds.length < 4) {
      const available = ALL_CANDIDATES.find((c) => !selectedIds.includes(c.id));
      if (available) setSelectedIds([...selectedIds, available.id]);
    }
  }

  function removeSlot(idx: number) {
    setSelectedIds(selectedIds.filter((_, i) => i !== idx));
  }

  const colCount = selected.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-2">
            <Link href="/candidates" className="hover:text-primary flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Candidates
            </Link>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-on-surface">Compare</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Compare Candidates</h1>
          <p className="text-on-surface-variant mt-1">
            Side-by-side analysis of criminal records, finances, education, and track record.
          </p>
        </div>
        {selectedIds.length < 4 && (
          <button
            onClick={addSlot}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Candidate
          </button>
        )}
      </div>

      {/* Candidate Selector Header */}
      <div
        className="grid gap-0 rounded-2xl overflow-hidden border border-outline-variant shadow-sm"
        style={{ gridTemplateColumns: `200px repeat(${colCount}, 1fr)` }}
      >
        {/* Corner label */}
        <div className="bg-surface-container p-5 border-b border-r border-outline-variant flex items-center">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Comparing {colCount} Candidates
          </span>
        </div>

        {/* Candidate headers */}
        {selected.map((c, idx) => (
          <div
            key={c.id}
            className="bg-surface-container p-5 border-b border-r last:border-r-0 border-outline-variant relative"
          >
            <button
              onClick={() => removeSlot(idx)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition flex items-center justify-center"
              title="Remove"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo}
                  alt={c.name}
                  className="w-16 h-16 rounded-full border-2 border-white shadow object-cover"
                />
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                  style={{ backgroundColor: c.partyColor }}
                />
              </div>
              <div>
                <button
                  onClick={() => setShowSelector(showSelector === idx ? null : idx)}
                  className="font-bold text-on-surface hover:text-primary transition flex items-center gap-1 mx-auto"
                >
                  {c.name}
                  <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                </button>
                <p className="text-xs text-on-surface-variant">{c.party}</p>
                <p className="text-xs text-outline mt-0.5">{c.constituency}</p>
              </div>
              {/* Dropdown */}
              {showSelector === idx && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-outline-variant rounded-xl shadow-xl z-30 overflow-hidden">
                  {ALL_CANDIDATES.filter((a) => !selectedIds.includes(a.id) || a.id === c.id).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => selectCandidate(idx, a.id)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-surface-container transition text-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.photo} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-on-surface">{a.name}</p>
                        <p className="text-xs text-on-surface-variant">{a.party} · {a.constituency}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section: Basic Info ── */}
      <section className="rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="bg-primary-container/40 border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Basic Profile</h2>
        </div>
        <MetricRow
          label="Age"
          icon="cake"
          highlight="none"
          values={selected.map((c) => ({ display: `${c.age} yrs`, raw: c.age }))}
        />
        <MetricRow
          label="Education"
          icon="school"
          highlight="none"
          values={selected.map((c) => ({ display: c.education }))}
        />
        <MetricRow
          label="Party"
          icon="flag"
          highlight="none"
          values={selected.map((c) => ({ display: c.party }))}
        />
        <MetricRow
          label="Constituency"
          icon="location_on"
          highlight="none"
          values={selected.map((c) => ({ display: c.constituency }))}
        />
        <MetricRow
          label="Terms Served"
          icon="history"
          highlight="highest"
          values={selected.map((c) => ({ display: c.terms === 0 ? "First-time" : `${c.terms} terms`, raw: c.terms }))}
        />
      </section>

      {/* ── Section: Criminal Record ── */}
      <section className="rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="bg-error-container/30 border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
            gavel
          </span>
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Criminal Record</h2>
        </div>
        <MetricRow
          label="Total Cases"
          icon="balance"
          highlight="lowest"
          values={selected.map((c) => ({
            display: c.criminal_cases === 0 ? "None" : `${c.criminal_cases} cases`,
            raw: c.criminal_cases,
            flag: c.criminal_cases > 0,
          }))}
        />
        <MetricRow
          label="Serious Cases"
          icon="report"
          highlight="lowest"
          values={selected.map((c) => ({
            display: c.serious_cases === 0 ? "None" : `${c.serious_cases} serious`,
            raw: c.serious_cases,
            flag: c.serious_cases > 0,
          }))}
        />
        <div
          className="grid gap-0 border-b border-outline-variant bg-surface-container-lowest"
          style={{ gridTemplateColumns: `200px repeat(${colCount}, 1fr)` }}
        >
          <div className="flex items-center gap-2 py-4 px-4 border-r border-outline-variant">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">info</span>
            <span className="text-sm font-medium text-on-surface-variant">Assessment</span>
          </div>
          {selected.map((c) => (
            <div key={c.id} className="py-4 px-6 border-r last:border-r-0 border-outline-variant text-center">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  c.criminal_cases === 0
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : c.serious_cases > 0
                    ? "bg-error-container text-on-error-container"
                    : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                {c.criminal_cases === 0 ? "Clean Record" : c.serious_cases > 0 ? "Serious Cases" : "Minor Cases"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Financial Profile ── */}
      <section className="rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="bg-tertiary-container/30 border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Financial Profile</h2>
        </div>
        <MetricRow
          label="Total Assets"
          icon="home"
          highlight="none"
          values={selected.map((c) => ({ display: c.assets, raw: c.assets_raw }))}
        />
        <MetricRow
          label="Liabilities"
          icon="credit_card"
          highlight="lowest"
          values={selected.map((c) => ({ display: c.liabilities }))}
        />
        <MetricRow
          label="Net Worth"
          icon="trending_up"
          highlight="none"
          values={selected.map((c) => ({ display: c.net_worth }))}
        />
      </section>

      {/* ── Section: Track Record ── */}
      <section className="rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="bg-secondary-container/30 border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Track Record</h2>
        </div>
        <MetricRow
          label="Legislature Attendance"
          icon="event_available"
          highlight="highest"
          values={selected.map((c) => ({
            display: c.attendance > 0 ? `${c.attendance}%` : "N/A (Newcomer)",
            raw: c.attendance,
            good: c.attendance >= 80,
          }))}
        />
        <MetricRow
          label="Questions Asked"
          icon="help"
          highlight="highest"
          values={selected.map((c) => ({
            display: c.questions_asked > 0 ? `${c.questions_asked}` : "N/A",
            raw: c.questions_asked,
          }))}
        />
        <MetricRow
          label="Elections Won"
          icon="emoji_events"
          highlight="highest"
          values={selected.map((c) => ({
            display: c.wins === 0 && c.terms === 0 ? "First-time" : `${c.wins} of ${c.terms}`,
            raw: c.wins,
          }))}
        />
      </section>

      {/* ── Section: Manifesto ── */}
      <section className="rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="bg-surface-container border-b border-outline-variant px-6 py-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            description
          </span>
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Key Issues</h2>
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: `200px repeat(${colCount}, 1fr)` }}
        >
          <div className="py-6 px-4 border-r border-outline-variant bg-surface-container-lowest flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">format_list_bulleted</span>
            <span className="text-sm font-medium text-on-surface-variant">Manifesto Focus</span>
          </div>
          {selected.map((c) => (
            <div
              key={c.id}
              className="py-6 px-6 border-r last:border-r-0 border-outline-variant bg-surface-container-lowest"
            >
              <ul className="space-y-2">
                {c.manifesto.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[14px] mt-0.5 flex-shrink-0">
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Summary ── */}
      <section className="bg-surface-container-low border border-primary-fixed-dim rounded-2xl p-6 flex gap-4 items-start">
        <div className="bg-primary-container p-2.5 rounded-full flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary-container">smart_toy</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary mb-2">AI Comparative Analysis</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {selected.length === 2
              ? `${selected[0].name} (${selected[0].party}) brings ${selected[0].terms > 0 ? `${selected[0].terms}-term legislative experience` : "fresh perspective as a first-time candidate"} while ${selected[1].name} (${selected[1].party}) ${selected[1].terms > 0 ? `is a ${selected[1].terms}-term incumbent` : "is contesting for the first time"}. On criminal record, ${
                  selected[0].criminal_cases < selected[1].criminal_cases
                    ? `${selected[0].name} has a cleaner record`
                    : selected[1].criminal_cases < selected[0].criminal_cases
                    ? `${selected[1].name} has a cleaner record`
                    : "both candidates have comparable records"
                }. Financial disclosures are sourced from ECI affidavits for the most recent election.`
              : `Comparing ${selected.length} candidates from ${[...new Set(selected.map((c) => c.constituency))].join(", ")}. Key differentiators include criminal record (${selected.filter((c) => c.criminal_cases === 0).map((c) => c.name).join(", ") || "none"} have clean records) and legislative experience. Review each tab for a detailed breakdown.`}
          </p>
          <p className="text-xs text-outline mt-3">
            Source: ECI Affidavits · ADR Reports · PRS Legislative Research
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-medium text-on-surface">Data verified against ECI Affidavits</span>
          </div>
          <span>Powered by ADR (Association for Democratic Reforms)</span>
        </div>
        <span>Last updated: May 2024</span>
      </footer>
    </div>
  );
}
