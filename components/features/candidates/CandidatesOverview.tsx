"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

interface Candidate {
  id: string;
  name: string;
  party_name?: string;
  party_abbreviation?: string;
  party_color?: string;
  photo_url?: string;
  age?: number;
  gender?: string;
  education?: string;
  criminal_cases?: number;
  assets_declared?: number;
  manifesto_summary?: string;
  constituency_name?: string;
}

function formatAssets(val?: number) {
  if (!val) return "₹0";
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)} Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const t = useTranslations("candidates");
  const isClean = (candidate.criminal_cases ?? 0) === 0;
  const partyColor = candidate.party_color ?? "#6366f1";

  return (
    <div
      className={`bg-white border border-outline-variant rounded-xl p-6 relative flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow ${
        isClean ? "border-t-4 border-t-tertiary" : ""
      }`}
    >
      {/* Badge */}
      <div className="absolute top-0 right-0 m-6 flex gap-2">
        {isClean ? (
          <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            {t("cleanRecord")}
          </span>
        ) : (
          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-error/20">
            <span className="material-symbols-outlined text-sm">warning</span>
            {t(
              (candidate.criminal_cases ?? 0) === 1
                ? "criminalCase"
                : "criminalCases",
              { count: candidate.criminal_cases ?? 0 }
            )}
          </span>
        )}
      </div>

      {/* Identity */}
      <div className="flex items-start gap-4 pt-2">
        {candidate.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={candidate.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-surface-variant"
            src={candidate.photo_url}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center text-primary border-2 border-surface-container">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-on-background">
            {candidate.name}
          </h2>
          <p className="text-base text-on-surface-variant flex items-center gap-2 mt-1">
            <span
              className="w-4 h-4 rounded-full inline-block border border-black/10"
              style={{ backgroundColor: partyColor }}
            />
            {candidate.party_name ?? "Independent"}
            {candidate.party_abbreviation
              ? ` (${candidate.party_abbreviation})`
              : ""}
          </p>
          <p className="text-xs text-outline mt-1">
            {candidate.constituency_name ?? ""}
            {candidate.age ? ` • Age ${candidate.age}` : ""}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 border-y border-outline-variant py-4 bg-surface-container-low/50 -mx-6 px-6">
        <div>
          <p className="text-xs text-on-surface-variant mb-1">
            {t("education")}
          </p>
          <p className="text-sm font-medium text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              school
            </span>
            {candidate.education ?? "—"}
          </p>
        </div>
        <div className="border-l border-outline-variant pl-4">
          <p className="text-xs text-on-surface-variant mb-1">
            {t("declaredAssets")}
          </p>
          <p className="text-sm font-medium text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              account_balance_wallet
            </span>
            {formatAssets(candidate.assets_declared)}
          </p>
        </div>
        <div className="border-l border-outline-variant pl-4">
          <p className="text-xs text-on-surface-variant mb-1">
            {t("pendingCases")}
          </p>
          <p
            className={`text-sm font-medium flex items-center gap-1 ${
              (candidate.criminal_cases ?? 0) > 0
                ? "text-error"
                : "text-tertiary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            {t("activeCases", { count: candidate.criminal_cases ?? 0 })}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <Link
          href={`/candidates/${candidate.id}`}
          className="block w-full bg-primary text-on-primary h-12 rounded-lg text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
        >
          {t("viewFullProfile")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

export function CandidatesOverview() {
  const t = useTranslations("candidates");
  const supabase = createClient();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [constituencies, setConstituencies] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedConstituency, setSelectedConstituency] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConstituencies() {
      // Only show constituencies that have at least one candidate
      const { data: candidateRows } = await supabase
        .from("candidates")
        .select("constituency_id");

      if (!candidateRows || candidateRows.length === 0) return;

      const ids = [...new Set((candidateRows as { constituency_id: string | null }[]).map((r) => r.constituency_id).filter(Boolean))];

      const { data } = await supabase
        .from("constituencies")
        .select("id, name")
        .in("id", ids)
        .order("name");

      if (data) setConstituencies(data);
    }
    fetchConstituencies();
  }, [supabase]);

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true);
      let query = supabase
        .from("candidates")
        .select(
          `id, name, photo_url, age,
           education, criminal_cases, assets_declared, manifesto_summary,
           parties(name, abbreviation, color),
           constituencies(name)`
        )
        .order("name");

      if (selectedConstituency) {
        query = query.eq("constituency_id", selectedConstituency);
      }

      const { data, error } = await query;
      if (data) {
        type CandidateRow = {
          id: string;
          name: string;
          photo_url?: string;
          age?: number;
          education?: string;
          criminal_cases?: number;
          assets_declared?: number;
          manifesto_summary?: string;
          parties?: { name?: string; abbreviation?: string; color?: string } | null;
          constituencies?: { name?: string } | null;
        };
        const mapped: Candidate[] = (data as CandidateRow[]).map((c) => ({
          id: c.id,
          name: c.name,
          party_name: c.parties?.name,
          party_abbreviation: c.parties?.abbreviation,
          party_color: c.parties?.color,
          photo_url: c.photo_url,
          age: c.age,
          education: c.education,
          criminal_cases: c.criminal_cases,
          assets_declared: c.assets_declared,
          manifesto_summary: c.manifesto_summary,
          constituency_name: c.constituencies?.name,
        }));
        setCandidates(mapped);
      } else if (error) {
        console.error("Candidates query error:", error.message);
      }
      setLoading(false);
    }
    fetchCandidates();
  }, [supabase, selectedConstituency]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-on-background mb-2 leading-tight">
          {t("title")}
        </h1>
        <p className="text-lg text-on-surface-variant mb-6">{t("subtitle")}</p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex-1 relative">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">
              {t("constituency")}
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 appearance-none focus:border-primary focus:ring-1 focus:ring-primary text-base text-on-surface"
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
              >
                <option value="">All Constituencies</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSelectedConstituency("")}
              className="bg-primary-container text-on-primary-container h-12 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors border border-primary-container w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">filter_list_off</span>
              <span className="text-sm font-medium">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-outline-variant rounded-xl p-6 h-64 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-full bg-surface-variant" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-5 bg-surface-variant rounded w-3/4" />
                  <div className="h-4 bg-surface-variant rounded w-1/2" />
                  <div className="h-3 bg-surface-variant rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-24 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-40">
            how_to_vote
          </span>
          <p className="text-xl font-medium">No candidates found</p>
          <p className="text-sm mt-2 opacity-70">
            Try selecting a different constituency or clear the filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
