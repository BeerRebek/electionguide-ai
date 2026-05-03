"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

type TimePeriod = "week" | "month" | "all";

const DATA: Record<TimePeriod, { rank: number; name: string; xp: number; streak: number; quizzes: number; badge: string; isMe?: boolean }[]> = {
  week: [
    { rank: 1, name: "Sneha Reddy", xp: 3200, streak: 14, quizzes: 22, badge: "🏆" },
    { rank: 2, name: "Vikrant Kapoor", xp: 2950, streak: 12, quizzes: 18, badge: "🥈" },
    { rank: 3, name: "Priya Iyer", xp: 2700, streak: 10, quizzes: 16, badge: "🥉" },
    { rank: 4, name: "Arun Mehta", xp: 2400, streak: 8, quizzes: 14, badge: "" },
    { rank: 5, name: "Rohan Saxena", xp: 2100, streak: 6, quizzes: 12, badge: "" },
    { rank: 6, name: "Kavitha Pillai", xp: 1800, streak: 5, quizzes: 10, badge: "" },
    { rank: 7, name: "Amit S.", xp: 950, streak: 3, quizzes: 5, badge: "", isMe: true },
    { rank: 8, name: "Deepa Nair", xp: 800, streak: 2, quizzes: 4, badge: "" },
    { rank: 9, name: "Sanjay Kumar", xp: 650, streak: 1, quizzes: 3, badge: "" },
    { rank: 10, name: "Fatima Shaikh", xp: 420, streak: 1, quizzes: 2, badge: "" },
  ],
  month: [
    { rank: 1, name: "Arun Mehta", xp: 8200, streak: 28, quizzes: 52, badge: "🏆" },
    { rank: 2, name: "Sneha Reddy", xp: 7800, streak: 25, quizzes: 48, badge: "🥈" },
    { rank: 3, name: "Vikrant Kapoor", xp: 7100, streak: 22, quizzes: 43, badge: "🥉" },
    { rank: 4, name: "Priya Iyer", xp: 6400, streak: 19, quizzes: 38, badge: "" },
    { rank: 5, name: "Rohan Saxena", xp: 5800, streak: 17, quizzes: 34, badge: "" },
    { rank: 6, name: "Kavitha Pillai", xp: 5200, streak: 15, quizzes: 30, badge: "" },
    { rank: 7, name: "Amit S.", xp: 1800, streak: 7, quizzes: 10, badge: "", isMe: true },
    { rank: 8, name: "Deepa Nair", xp: 1400, streak: 4, quizzes: 7, badge: "" },
    { rank: 9, name: "Sanjay Kumar", xp: 1100, streak: 2, quizzes: 5, badge: "" },
    { rank: 10, name: "Fatima Shaikh", xp: 900, streak: 1, quizzes: 4, badge: "" },
  ],
  all: [
    { rank: 1, name: "Arun Mehta", xp: 12450, streak: 42, quizzes: 85, badge: "🏆" },
    { rank: 2, name: "Sneha Reddy", xp: 11200, streak: 38, quizzes: 79, badge: "🥈" },
    { rank: 3, name: "Vikrant Kapoor", xp: 10850, streak: 35, quizzes: 72, badge: "🥉" },
    { rank: 4, name: "Priya Iyer", xp: 9600, streak: 29, quizzes: 65, badge: "" },
    { rank: 5, name: "Rohan Saxena", xp: 8900, streak: 25, quizzes: 61, badge: "" },
    { rank: 6, name: "Kavitha Pillai", xp: 8200, streak: 22, quizzes: 55, badge: "" },
    { rank: 7, name: "Amit S.", xp: 2450, streak: 5, quizzes: 12, badge: "", isMe: true },
    { rank: 8, name: "Deepa Nair", xp: 2100, streak: 3, quizzes: 9, badge: "" },
    { rank: 9, name: "Sanjay Kumar", xp: 1800, streak: 2, quizzes: 7, badge: "" },
    { rank: 10, name: "Fatima Shaikh", xp: 1500, streak: 1, quizzes: 5, badge: "" },
  ],
};

const TIER_LABELS = [
  { min: 10000, label: "Legend", color: "#f59e0b", icon: "military_tech" },
  { min: 5000, label: "Champion", color: "#8b5cf6", icon: "emoji_events" },
  { min: 2000, label: "Expert", color: "#3b82f6", icon: "workspace_premium" },
  { min: 500, label: "Learner", color: "#10b981", icon: "school" },
  { min: 0, label: "Starter", color: "#6b7280", icon: "stars" },
];

function getTier(xp: number) {
  return TIER_LABELS.find((t) => xp >= t.min) ?? TIER_LABELS[TIER_LABELS.length - 1];
}

const PERIOD_LABELS: { key: TimePeriod; label: string }[] = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<TimePeriod>("all");
  const users = DATA[period];
  const top3 = [users[1], users[0], users[2]]; // 2nd, 1st, 3rd for visual podium

  const podiumHeights = ["h-28", "h-40", "h-24"];
  const podiumBg = [
    "from-gray-300 to-gray-400",
    "from-amber-300 to-amber-500",
    "from-orange-300 to-orange-400",
  ];
  const podiumRing = ["ring-gray-300", "ring-amber-400", "ring-orange-400"];
  const podiumText = ["text-gray-600", "text-amber-700", "text-orange-700"];
  const podiumLabel = ["2nd", "1st", "3rd"];

  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="max-w-[960px] mx-auto px-4 pb-16 pt-24" role="main">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container mb-4 shadow-sm">
            <span className="material-symbols-outlined text-3xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Leaderboard</h1>
          <p className="text-on-surface-variant text-base">Top civic champions. Compete, learn, and rise.</p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center gap-2 mb-10">
          {PERIOD_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                period === key
                  ? "bg-primary text-on-primary border-primary shadow-md"
                  : "text-on-surface-variant border-outline-variant hover:bg-surface-container"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Podium */}
        <section aria-label="Top 3 Podium" className="flex justify-center items-end gap-3 mb-12">
          {top3.map((user, idx) => {
            const tier = getTier(user.xp);
            return (
              <div key={user.name} className="flex flex-col items-center gap-2 w-28 md:w-36">
                {/* Avatar + badge */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ${podiumRing[idx]} bg-surface-container-high flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center text-base shadow-sm">
                    {user.badge}
                  </div>
                </div>
                {/* Name */}
                <span className="text-xs md:text-sm font-semibold text-on-surface text-center leading-tight">{user.name}</span>
                <span className={`text-xs font-bold ${podiumText[idx]}`}>{user.xp.toLocaleString()} XP</span>
                {/* Podium block */}
                <div
                  className={`w-full ${podiumHeights[idx]} bg-gradient-to-t ${podiumBg[idx]} rounded-t-xl flex items-start justify-center pt-2 shadow-inner`}
                >
                  <span className="text-sm font-bold text-white/80">{podiumLabel[idx]}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Rankings Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant">
            <h2 className="text-lg font-semibold text-on-surface">All Rankings</h2>
          </div>
          <table className="w-full" role="table">
            <thead>
              <tr className="bg-surface-container text-xs text-on-surface-variant uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-medium" scope="col">Rank</th>
                <th className="px-5 py-3 text-left font-medium" scope="col">Citizen</th>
                <th className="px-5 py-3 text-right font-medium" scope="col">Tier</th>
                <th className="px-5 py-3 text-right font-medium" scope="col">XP</th>
                <th className="px-5 py-3 text-right font-medium hidden md:table-cell" scope="col">Streak</th>
                <th className="px-5 py-3 text-right font-medium hidden md:table-cell" scope="col">Quizzes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((user) => {
                const tier = getTier(user.xp);
                return (
                  <tr
                    key={user.rank}
                    className={`transition-colors ${
                      user.isMe
                        ? "bg-primary-container/10 border-l-4 border-l-primary"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <td className="px-5 py-4 text-sm font-bold text-on-surface">
                      {user.badge ? (
                        <span className="text-xl">{user.badge}</span>
                      ) : (
                        <span className="text-on-surface-variant">#{user.rank}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className={`text-sm font-semibold ${user.isMe ? "text-primary" : "text-on-surface"}`}>
                            {user.name}{user.isMe && <span className="ml-1 text-xs text-on-surface-variant font-normal">(You)</span>}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: tier.color + "22", color: tier.color }}
                      >
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{tier.icon}</span>
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-on-surface text-right">
                      {user.xp.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant text-right hidden md:table-cell">
                      🔥 {user.streak}d
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant text-right hidden md:table-cell">
                      {user.quizzes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-surface-container-low border border-outline-variant rounded-xl p-5">
          <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
            Tier System
          </h3>
          <div className="flex flex-wrap gap-3">
            {TIER_LABELS.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: t.color + "22", color: t.color }}
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                {t.label} ({t.min.toLocaleString()}+ XP)
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
