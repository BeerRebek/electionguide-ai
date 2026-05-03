"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/shared/Footer";

interface NewsItem {
  id: string;
  category: string;
  tag: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  readTime: string;
  icon: string;
  featured?: boolean;
  href: string;
}

const CATEGORIES = ["All", "ECI Updates", "Election Dates", "Model Code", "Technology", "Voter Rights", "Results"];

const CATEGORY_META: Record<string, { color: string; bg: string; border: string }> = {
  "ECI Updates":    { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  "Election Dates": { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  "Model Code":     { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  "Technology":     { color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  "Voter Rights":   { color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  "Results":        { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
};

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    category: "ECI Updates",
    tag: "Official",
    title: "ECI Launches 'Voter Mitra' AI Chatbot for 2024 General Elections",
    summary: "The Election Commission of India has deployed an AI-powered chatbot named 'Voter Mitra' across 12 languages to help voters find booth locations, check registration status, and get real-time answers to election queries.",
    source: "Election Commission of India",
    date: "Apr 28, 2024",
    readTime: "3 min read",
    icon: "smart_toy",
    featured: true,
    href: "https://eci.gov.in",
  },
  {
    id: "2",
    category: "Election Dates",
    tag: "Breaking",
    title: "Schedule for 18th Lok Sabha General Elections 2024 Announced",
    summary: "Voting to take place in 7 phases from April 19 to June 1, 2024. Results will be declared on June 4. The MCC comes into effect immediately.",
    source: "Press Information Bureau",
    date: "Mar 16, 2024",
    readTime: "5 min read",
    icon: "event",
    featured: true,
    href: "https://eci.gov.in",
  },
  {
    id: "3",
    category: "Technology",
    tag: "Innovation",
    title: "VVPAT Slips Now Counted in 5 Randomly Selected EVMs Per Assembly Segment",
    summary: "The Supreme Court upheld the ECI's decision to count VVPAT slips from 5 randomly selected EVMs per assembly constituency, enhancing voter confidence in the electronic voting system.",
    source: "Supreme Court of India",
    date: "Apr 26, 2024",
    readTime: "4 min read",
    icon: "verified",
    href: "https://eci.gov.in",
  },
  {
    id: "4",
    category: "Voter Rights",
    tag: "Rights",
    title: "Persons with Disabilities: New Home Voting Facility Expanded Nationwide",
    summary: "ECI has expanded the 'Home Voting' facility to all voters above 85 years of age and PwD voters with 40%+ disability. Apply via Form 12D through your local BLO before the deadline.",
    source: "Election Commission of India",
    date: "Apr 22, 2024",
    readTime: "3 min read",
    icon: "accessible",
    href: "https://eci.gov.in",
  },
  {
    id: "5",
    category: "Model Code",
    tag: "MCC",
    title: "Model Code of Conduct In Effect: What Voters and Candidates Need to Know",
    summary: "With MCC now in effect, parties cannot announce new government schemes, distribute cash, use government resources for campaigning, or hold rallies without police permission. Violations can be reported via cVIGIL.",
    source: "Election Commission of India",
    date: "Mar 16, 2024",
    readTime: "6 min read",
    icon: "gavel",
    href: "https://eci.gov.in",
  },
  {
    id: "6",
    category: "ECI Updates",
    tag: "Update",
    title: "Voter Turnout App Goes Live: Track Real-Time Voting Numbers by Constituency",
    summary: "ECI's Voter Turnout app now provides real-time voting percentages by polling station, assembly segment, and parliamentary constituency. Data is updated every 2 hours on polling day.",
    source: "Election Commission of India",
    date: "Apr 15, 2024",
    readTime: "2 min read",
    icon: "bar_chart",
    href: "https://eci.gov.in",
  },
  {
    id: "7",
    category: "Technology",
    tag: "Security",
    title: "ECI Clarifies: EVMs Are Standalone Devices — Not Connected to Internet or Bluetooth",
    summary: "Following concerns raised on social media, ECI reiterated that Electronic Voting Machines operate in total isolation with no Wi-Fi, Bluetooth, or internet connectivity at any point during the election process.",
    source: "Election Commission of India",
    date: "Apr 10, 2024",
    readTime: "4 min read",
    icon: "lock",
    href: "https://eci.gov.in",
  },
  {
    id: "8",
    category: "Election Dates",
    tag: "State",
    title: "Bihar Assembly By-Elections: Dates Announced for 4 Constituencies",
    summary: "The Election Commission has announced by-elections for 4 Bihar assembly constituencies — Rupauli, Belaganj, Imamganj, and Rajauli — to be held alongside Lok Sabha Phase 5.",
    source: "Election Commission of India",
    date: "Apr 5, 2024",
    readTime: "3 min read",
    icon: "ballot",
    href: "https://eci.gov.in",
  },
  {
    id: "9",
    category: "Voter Rights",
    tag: "Service",
    title: "EPIC Express Delivery Launched: Get Voter ID Card Within 5 Days",
    summary: "ECI has partnered with India Post to deliver plastic EPIC cards to newly registered voters within 5 working days of registration confirmation. The service is available in all 543 parliamentary constituencies.",
    source: "Election Commission of India",
    date: "Mar 28, 2024",
    readTime: "2 min read",
    icon: "credit_card",
    href: "https://eci.gov.in",
  },
];

const TRENDING = [
  { title: "Check your name on Electoral Roll", href: "/registration/status" },
  { title: "Understanding NOTA — None of the Above", href: "/guides/voting-day" },
  { title: "How cVIGIL complaints are resolved in 100 minutes", href: "/guides/file-complaint" },
  { title: "NRI Voting: Form 6A explained", href: "/guides/nri-voting" },
  { title: "EVM tampering myths vs. facts", href: "/guides/evm-vvpat" },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = NEWS_ITEMS.filter((n) => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch =
      search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = NEWS_ITEMS.filter((n) => n.featured);
  const rest = filtered.filter((n) => !n.featured || activeCategory !== "All" || search !== "");

  return (
    <>
      <main id="main-content" className="min-h-screen bg-[#F0F4FF] pt-6 pb-16">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#00236f] to-[#1e3a8a] py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-5">
              <span className="material-symbols-outlined text-white text-base">newspaper</span>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Election News & Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Stay Informed.<br />
              <span className="text-[#b6c4ff]">Vote with Facts.</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-8">
              Official election announcements, ECI updates, MCC news, and voter rights coverage — curated from trusted government sources.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl">search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search election news…"
                className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/50 text-[15px] focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
              />
            </div>
          </div>
        </section>

        {/* ── Category Tabs ─────────────────────────────────────── */}
        <div className="bg-white border-b border-outline-variant sticky top-16 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Main Feed ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Featured (only show on All tab with no search) */}
              {activeCategory === "All" && search === "" && (
                <section>
                  <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-base">star</span>
                    Top Stories
                  </h2>
                  <div className="space-y-4">
                    {featured.map((item) => {
                      const meta = CATEGORY_META[item.category];
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white border border-outline-variant rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 block"
                        >
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${meta?.bg ?? "bg-primary/10"}`}>
                            <span className={`material-symbols-outlined text-xl ${meta?.color ?? "text-primary"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                              {item.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${meta?.bg} ${meta?.color}`}>
                                {item.category}
                              </span>
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                                {item.tag}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-on-background group-hover:text-primary transition-colors leading-snug mb-1.5">
                              {item.title}
                            </h3>
                            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                              {item.summary}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-outline">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">source</span>
                                {item.source}
                              </span>
                              <span>·</span>
                              <span>{item.date}</span>
                              <span>·</span>
                              <span>{item.readTime}</span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Rest of articles */}
              <section>
                {(activeCategory !== "All" || search !== "") && (
                  <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                    {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    {activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
                    {search ? ` for "${search}"` : ""}
                  </h2>
                )}
                {(activeCategory === "All" && search === "") && (
                  <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">schedule</span>
                    Latest Updates
                  </h2>
                )}

                {filtered.length === 0 ? (
                  <div className="bg-white border border-outline-variant rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-3 block">search_off</span>
                    <p className="text-on-surface-variant">No news found for &ldquo;{search}&rdquo;</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rest.map((item) => {
                      const meta = CATEGORY_META[item.category];
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white border border-outline-variant rounded-xl p-4 flex gap-4 hover:shadow-sm hover:border-primary/40 transition-all duration-150 block"
                        >
                          <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${meta?.bg ?? "bg-primary/10"}`}>
                            <span className={`material-symbols-outlined text-lg ${meta?.color ?? "text-primary"}`}>
                              {item.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${meta?.bg} ${meta?.color}`}>
                                {item.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-on-background group-hover:text-primary transition-colors leading-snug mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-outline">
                              <span>{item.source}</span>
                              <span>·</span>
                              <span>{item.date}</span>
                              <span>·</span>
                              <span>{item.readTime}</span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Disclaimer */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-outline text-xl flex-shrink-0 mt-0.5">info</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  News content is curated from official government sources including ECI, PIB, and the Supreme Court of India. ElectionGuide AI does not publish original news. Always verify information at <strong>eci.gov.in</strong>.
                </p>
              </div>
            </div>

            {/* ── Sidebar ────────────────────────────────────────── */}
            <aside className="space-y-6">

              {/* Ask AI CTA */}
              <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5">
                <span className="material-symbols-outlined text-white text-3xl mb-3 block">smart_toy</span>
                <h3 className="text-base font-bold text-white mb-1.5">Questions about this news?</h3>
                <p className="text-white/80 text-sm mb-4">Our AI assistant can explain any election update in simple terms.</p>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 bg-white text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Ask AI
                </Link>
              </div>

              {/* Trending Topics */}
              <div className="bg-white border border-outline-variant rounded-2xl p-5">
                <h3 className="text-sm font-bold text-on-background mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                  Trending on ElectionGuide
                </h3>
                <ol className="space-y-3">
                  {TRENDING.map((t, i) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="flex items-center gap-3 group"
                      >
                        <span className="text-lg font-black text-primary/30 w-6 flex-shrink-0 leading-none">{i + 1}</span>
                        <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors leading-snug">{t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Official Links */}
              <div className="bg-white border border-outline-variant rounded-2xl p-5">
                <h3 className="text-sm font-bold text-on-background mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                  Official Sources
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Election Commission of India", href: "https://eci.gov.in", icon: "account_balance" },
                    { label: "Voter Helpline 1950", href: "tel:1950", icon: "call" },
                    { label: "Voter Portal (NVSP)", href: "https://voterportal.eci.gov.in", icon: "how_to_reg" },
                    { label: "cVIGIL App (Complaints)", href: "https://cvigil.eci.gov.in", icon: "report" },
                    { label: "Suvidha Portal (Candidates)", href: "https://suvidha.eci.gov.in", icon: "record_voice_over" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-container-low transition-colors group"
                    >
                      <span className="material-symbols-outlined text-primary text-[16px]">{link.icon}</span>
                      <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{link.label}</span>
                      <span className="material-symbols-outlined text-outline text-[14px] ml-auto">open_in_new</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Tools */}
              <div className="bg-white border border-outline-variant rounded-2xl p-5">
                <h3 className="text-sm font-bold text-on-background mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">bolt</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Check Registration Status", href: "/registration/status", icon: "search" },
                    { label: "Find Polling Booth", href: "/booth-finder", icon: "location_on" },
                    { label: "Compare Candidates", href: "/candidates/compare", icon: "compare" },
                    { label: "Quiz: Test Your Knowledge", href: "/quiz", icon: "quiz" },
                  ].map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-container-low transition-colors group"
                    >
                      <span className="material-symbols-outlined text-primary text-[16px]">{a.icon}</span>
                      <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
