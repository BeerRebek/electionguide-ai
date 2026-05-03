"use client";

import { useState } from "react";
import Link from "next/link";

interface NotifPref {
  enabled: boolean;
  inApp: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

type PrefKey =
  | "elections"
  | "phaseDeadlines"
  | "voterList"
  | "dailyQuiz"
  | "newGuides"
  | "boothChanges"
  | "weather"
  | "milestones";

interface PrefRow {
  key: PrefKey;
  icon: string;
  label: string;
  description: string;
  critical?: boolean;
}

const PREF_ROWS: PrefRow[] = [
  {
    key: "elections",
    icon: "how_to_vote",
    label: "Election Announcements",
    description: "State-specific election dates, MCC, and official updates",
  },
  {
    key: "phaseDeadlines",
    icon: "event_upcoming",
    label: "Phase Deadlines",
    description: "Reminders 1 week, 1 day, and on election day",
    critical: true,
  },
  {
    key: "voterList",
    icon: "format_list_bulleted",
    label: "Voter List Updates",
    description: "Annual updates on Jan 1, Apr 1, Jul 1, Oct 1",
  },
  {
    key: "dailyQuiz",
    icon: "quiz",
    label: "Daily Quiz Challenge",
    description: "Daily civic knowledge question notification",
  },
  {
    key: "newGuides",
    icon: "menu_book",
    label: "New Guides Published",
    description: "When new guides and resources are added",
  },
  {
    key: "boothChanges",
    icon: "location_on",
    label: "Booth Changes",
    description: "If your assigned polling booth changes location",
    critical: true,
  },
  {
    key: "weather",
    icon: "cloud",
    label: "Weather Alerts",
    description: "Weather warnings for your polling area on election day",
  },
  {
    key: "milestones",
    icon: "celebration",
    label: "Personalized Milestones",
    description: "Voter readiness achievements and progress updates",
  },
];

const DEFAULT_PREFS: Record<PrefKey, NotifPref> = {
  elections: { enabled: true, inApp: true, email: true, push: true, sms: false },
  phaseDeadlines: { enabled: true, inApp: true, email: true, push: true, sms: true },
  voterList: { enabled: true, inApp: true, email: true, push: false, sms: false },
  dailyQuiz: { enabled: true, inApp: true, email: false, push: true, sms: false },
  newGuides: { enabled: true, inApp: true, email: false, push: false, sms: false },
  boothChanges: { enabled: true, inApp: true, email: true, push: true, sms: true },
  weather: { enabled: false, inApp: true, email: false, push: false, sms: false },
  milestones: { enabled: true, inApp: true, email: false, push: true, sms: false },
};

const CHANNEL_ICONS: Record<string, string> = {
  inApp: "notifications",
  email: "email",
  push: "phone_iphone",
  sms: "sms",
};

const CHANNEL_LABELS: Record<string, string> = {
  inApp: "In-App",
  email: "Email",
  push: "Push",
  sms: "SMS",
};

export function NotificationSettingsClient() {
  const [prefs, setPrefs] =
    useState<Record<PrefKey, NotifPref>>(DEFAULT_PREFS);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [quietEnabled, setQuietEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleEnabled = (key: PrefKey) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const toggleChannel = (
    key: PrefKey,
    channel: keyof Omit<NotifPref, "enabled">
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [channel]: !prev[key][channel] },
    }));
  };

  const handleSave = () => {
    // In production: persist to Supabase user_preferences table
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                tune
              </span>
              Notification Settings
            </h1>
            <p className="text-sm text-on-surface-variant">
              Choose what to be notified about and how
            </p>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  bedtime
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Quiet Hours</p>
                <p className="text-xs text-on-surface-variant">
                  No notifications during this time
                </p>
              </div>
            </div>
            {/* Toggle */}
            <button
              onClick={() => setQuietEnabled((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                quietEnabled ? "bg-primary" : "bg-surface-dim"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  quietEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {quietEnabled && (
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="text-xs text-on-surface-variant block mb-1">
                  From
                </label>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <span className="text-on-surface-variant mt-4">to</span>
              <div className="flex-1">
                <label className="text-xs text-on-surface-variant block mb-1">
                  To
                </label>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Per-type preferences */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden mb-4">
          {/* Column headers */}
          <div className="flex items-center gap-3 px-5 py-3 bg-surface-container border-b border-outline-variant">
            <div className="flex-1 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Notification Type
            </div>
            <div className="flex gap-4 items-center">
              {["inApp", "email", "push", "sms"].map((ch) => (
                <div
                  key={ch}
                  className="w-10 text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex flex-col items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    {CHANNEL_ICONS[ch]}
                  </span>
                  {CHANNEL_LABELS[ch]}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-outline-variant/50">
            {PREF_ROWS.map((row) => {
              const pref = prefs[row.key];
              return (
                <li
                  key={row.key}
                  className={`flex items-center gap-3 px-5 py-4 transition-colors ${
                    !pref.enabled ? "opacity-60" : ""
                  }`}
                >
                  {/* Master toggle */}
                  <button
                    onClick={() => toggleEnabled(row.key)}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                      pref.enabled ? "bg-primary" : "bg-surface-dim"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        pref.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {/* Icon + label */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">
                      {row.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-on-surface">
                          {row.label}
                        </p>
                        {row.critical && (
                          <span className="text-[9px] bg-error-container text-error px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">
                        {row.description}
                      </p>
                    </div>
                  </div>

                  {/* Channel toggles */}
                  <div className="flex gap-4 items-center flex-shrink-0">
                    {(["inApp", "email", "push", "sms"] as const).map((ch) => (
                      <button
                        key={ch}
                        disabled={!pref.enabled}
                        onClick={() => toggleChannel(row.key, ch)}
                        className={`w-10 flex items-center justify-center h-7 rounded-lg transition-all ${
                          pref[ch] && pref.enabled
                            ? "bg-primary-container text-primary"
                            : "bg-surface-container text-on-surface-variant/40"
                        } disabled:cursor-not-allowed`}
                        title={`${CHANNEL_LABELS[ch]}: ${pref[ch] ? "On" : "Off"}`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {pref[ch] && pref.enabled ? "check" : "close"}
                        </span>
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            SMS notifications only sent for critical alerts (Phase Deadlines, Booth Changes).
          </p>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-primary text-on-primary hover:opacity-90"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {saved ? "check_circle" : "save"}
            </span>
            {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
