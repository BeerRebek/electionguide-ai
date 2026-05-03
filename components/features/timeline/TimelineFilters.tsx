"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type ViewMode = "phase" | "calendar";

interface TimelineFiltersProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onFilterChange?: (filters: { electionType: string; state: string; year: string }) => void;
}

const ELECTION_TYPES = ["lok_sabha", "vidhan_sabha"] as const;
const STATES = ["all_india", "up", "maharashtra", "west_bengal", "tamil_nadu", "bihar", "karnataka", "delhi"] as const;
const YEARS = ["2024", "2019", "2014"] as const;

export function TimelineFilters({ viewMode, onViewChange, onFilterChange }: TimelineFiltersProps) {
  const t = useTranslations("timeline");
  const [electionType, setElectionType] = useState<string>(ELECTION_TYPES[0]);
  const [state, setState] = useState<string>(STATES[0]);
  const [year, setYear] = useState<string>(YEARS[0]);

  const handleChange = (key: string, value: string) => {
    const newFilters = { electionType, state, year, [key]: value };
    if (key === "electionType") setElectionType(value);
    if (key === "state") setState(value);
    if (key === "year") setYear(value);
    onFilterChange?.(newFilters);
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-12 shadow-sm flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
        {/* Election Type */}
        <div className="flex flex-col">
          <label className="text-xs text-on-surface-variant mb-1 ml-1 font-medium">
            {t("filter_election_type")}
          </label>
          <div className="relative">
            <select
              value={electionType}
              onChange={(e) => handleChange("electionType", e.target.value)}
              className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px] min-h-[48px] cursor-pointer"
            >
              {ELECTION_TYPES.map((typeKey) => (
                <option key={typeKey} value={typeKey}>
                  {t(`election_types.${typeKey}`)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* State / UT */}
        <div className="flex flex-col">
          <label className="text-xs text-on-surface-variant mb-1 ml-1 font-medium">
            {t("filter_state_ut")}
          </label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px] min-h-[48px] cursor-pointer"
            >
              {STATES.map((stateKey) => (
                <option key={stateKey} value={stateKey}>
                  {t(`states.${stateKey}`)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="text-xs text-on-surface-variant mb-1 ml-1 font-medium">
            {t("filter_year")}
          </label>
          <div className="relative">
            <select
              value={year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary min-w-[120px] min-h-[48px] cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 border border-outline-variant rounded-lg p-1 bg-surface">
        <button
          onClick={() => onViewChange("phase")}
          className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 min-h-[40px] transition-colors ${
            viewMode === "phase"
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">linear_scale</span>
          {t("view_phase")}
        </button>
        <button
          onClick={() => onViewChange("calendar")}
          className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 min-h-[40px] transition-colors ${
            viewMode === "calendar"
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          {t("view_calendar")}
        </button>
      </div>
    </section>
  );
}
