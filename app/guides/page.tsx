"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/shared/Footer";

interface Guide {
  id: string;
  slug: string;
  title: string;
  category: string;
  bite_summary: string | null;
  icon: string | null;
  order_index: number;
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  registration: {
    label: "Registration",
    icon: "how_to_reg",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  voting: {
    label: "Voting Day",
    icon: "ballot",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  evm: {
    label: "EVM & VVPAT",
    icon: "how_to_vote",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  candidacy: {
    label: "Candidacy",
    icon: "record_voice_over",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  grievance: {
    label: "Grievances",
    icon: "report",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  special: {
    label: "NRI & Special",
    icon: "flight",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  accessibility: {
    label: "Accessibility",
    icon: "accessible",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
};

const SLUG_HREF: Record<string, string> = {
  "voter-registration": "/guides/voter-registration",
  "voting-day": "/guides/voting-day",
  "evm-vvpat": "/guides/evm-vvpat",
  "become-candidate": "/guides/become-candidate",
  "file-complaint": "/guides/file-complaint",
  "nri-voting": "/guides/nri-voting",
  "pwd-voting": "/guides/pwd-voting",
};

const STATIC_GUIDES: Guide[] = [
  { id: "1", slug: "voter-registration", title: "How to Register as a Voter", category: "registration", bite_summary: "Register online via NVSP or visit your BLO with Form 6. Deadline is typically 10 days before the election date.", icon: "how_to_reg", order_index: 1 },
  { id: "2", slug: "voting-day", title: "What to Do on Voting Day", category: "voting", bite_summary: "Carry your Voter ID or any of 12 alternate IDs to your designated booth. Polls open from 7 AM to 6 PM.", icon: "ballot", order_index: 2 },
  { id: "3", slug: "evm-vvpat", title: "Understanding EVM & VVPAT", category: "evm", bite_summary: "EVMs are tamper-proof electronic voting machines. VVPAT gives you a 7-second paper slip confirming your vote.", icon: "how_to_vote", order_index: 3 },
  { id: "4", slug: "become-candidate", title: "How to Contest an Election", category: "candidacy", bite_summary: "File Form 2B nomination with ₹25,000 deposit at the Returning Officer's office within the nomination window.", icon: "record_voice_over", order_index: 4 },
  { id: "5", slug: "file-complaint", title: "How to File an Election Complaint", category: "grievance", bite_summary: "Report code violations via cVIGIL app with geo-tagged photo/video. ECI resolves complaints within 100 minutes.", icon: "report", order_index: 5 },
  { id: "6", slug: "nri-voting", title: "NRI Voting Guide", category: "special", bite_summary: "NRIs can register via Form 6A and must vote in person at their home constituency. No postal ballot for NRIs.", icon: "flight", order_index: 6 },
  { id: "7", slug: "pwd-voting", title: "Voting Rights for Persons with Disabilities", category: "accessibility", bite_summary: "PwD voters get priority queuing, Braille ballots, helper allowance, home voting (85+ or 40%+ disability), and postal ballot.", icon: "accessible", order_index: 7 },
];

const FEATURED_SLUGS = ["voter-registration", "voting-day", "evm-vvpat"];

const STATS = [
  { icon: "menu_book", value: "7+", label: "Official Guides" },
  { icon: "groups", value: "94.5Cr", label: "Registered Voters" },
  { icon: "how_to_vote", value: "10.5L+", label: "Polling Stations" },
  { icon: "verified", value: "ECI", label: "Official Source" },
];

const FAQS = [
  { q: "What documents can I use if I don't have a Voter ID card?", a: "You can use any of 12 alternate photo IDs: Aadhaar card, MNREGA job card, pension document with photo, passbook issued by bank/post office, health insurance smart card under Rashtriya Swasthya Bima Yojana, driving licence, PAN card, smart card issued by RGI under NPR, Indian passport, service identity cards with photo issued to employees by central/state govts, PSUs, public limited companies, and a photo identity card issued by recognized educational institutions." },
  { q: "How do I check my name on the electoral roll?", a: "Visit voterportal.eci.gov.in or the Voter Helpline app. Enter your name, date of birth, and state. You can also call 1950 (national voter helpline) or visit your local Electoral Registration Officer." },
  { q: "What is Model Code of Conduct (MCC)?", a: "MCC is a set of guidelines issued by ECI that becomes effective from the date of election announcement until the results are declared. It regulates political parties and candidates on speeches, polling day activities, election manifesto, processions, and general conduct." },
  { q: "Can I vote from a different city if I'm registered elsewhere?", a: "No. You must vote in the constituency where you are registered. However, you can transfer your registration if you've shifted permanently by filing Form 8A. For elections while away, apply for a postal ballot if you qualify (government employees, armed forces, etc.)." },
  { q: "What is NOTA and how do I use it?", a: "NOTA (None of the Above) is an option on the EVM that lets you register your presence while rejecting all candidates. Press the button for NOTA (usually the last option). NOTA votes are counted but even if NOTA gets the most votes, the candidate with the highest votes among those contesting wins." },
];

const QUICK_TOOLS = [
  { icon: "search", label: "Verify Registration", desc: "Check if your name is on the roll", href: "/registration/status", color: "text-blue-700", bg: "bg-blue-50" },
  { icon: "location_on", label: "Find Your Booth", desc: "Locate your nearest polling station", href: "/booth-finder", color: "text-indigo-700", bg: "bg-indigo-50" },
  { icon: "how_to_reg", label: "Register to Vote", desc: "New voter? Apply online via Form 6", href: "/registration/new", color: "text-violet-700", bg: "bg-violet-50" },
  { icon: "smart_toy", label: "Ask AI", desc: "Get instant answers on elections", href: "/chat", color: "text-orange-700", bg: "bg-orange-50" },
];

export default function GuidesPage() {
  const supabase = createClient();
  const [guides, setGuides] = useState<Guide[]>(STATIC_GUIDES);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("guides")
        .select("id, slug, title, category, bite_summary, icon, order_index")
        .order("order_index");
      if (data && data.length > 0) {
        setGuides(data as Guide[]);
      } else {
        if (error) console.warn("Guides query failed, using static data:", error.message);
        setGuides(STATIC_GUIDES);
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueCategories = Array.from(new Set(guides.map((g) => g.category)));
  const categories = ["all", ...uniqueCategories];

  const filtered = guides.filter((g) => {
    const matchCat = filter === "all" || g.category === filter;
    const matchSearch =
      search === "" ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      (g.bite_summary ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = STATIC_GUIDES.filter((g) => FEATURED_SLUGS.includes(g.slug));

  return (
    <>
      <main id="main-content" className="min-h-screen bg-[#F0F4FF] pt-6 pb-16">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary to-primary-container py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-5">
              <span className="material-symbols-outlined text-white text-base">menu_book</span>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Voter Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Everything You Need to <br className="hidden md:block" />
              <span className="text-[#b6c4ff]">Vote with Confidence</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-8">
              Official step-by-step guides on voter registration, EVM process, candidacy, grievances, and more — all sourced from the Election Commission of India.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guides — e.g. postal ballot, Form 6, NOTA…"
                className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/50 text-[15px] focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
              />
            </div>
          </div>
        </section>

        {/* ── Stats Bar ────────────────────────────────────────── */}
        <section className="bg-white border-b border-outline-variant">
          <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">{s.icon}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-on-background leading-none">{s.value}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

          {/* ── Quick Tools ──────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-bold text-on-background mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              Quick Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUICK_TOOLS.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="group bg-white border border-outline-variant rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.bg}`}>
                    <span className={`material-symbols-outlined text-xl ${t.color}`}>{t.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-background group-hover:text-primary transition-colors">{t.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Featured Guides ──────────────────────────────────── */}
          {search === "" && filter === "all" && (
            <section>
              <h2 className="text-xl font-bold text-on-background mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">star</span>
                Most Read Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map((guide, idx) => {
                  const meta = CATEGORY_META[guide.category] ?? CATEGORY_META["voting"];
                  const href = SLUG_HREF[guide.slug] ?? `/guides/${guide.slug}`;
                  return (
                    <Link
                      key={guide.id}
                      href={href}
                      className={`group relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${meta.border}`}
                    >
                      {idx === 0 && (
                        <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">#1 Most Read</div>
                      )}
                      <div className={`h-2 w-full ${meta.bg}`} />
                      <div className="p-5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.bg} mb-3`}>
                          <span className={`material-symbols-outlined text-xl ${meta.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{guide.icon ?? meta.icon}</span>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} mb-2 inline-block`}>{meta.label}</span>
                        <h3 className="text-base font-semibold text-on-background mb-1.5 group-hover:text-primary transition-colors leading-snug">{guide.title}</h3>
                        <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{guide.bite_summary}</p>
                        <div className="flex items-center gap-1 mt-4 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                          Read Full Guide
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── All Guides ───────────────────────────────────────── */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">library_books</span>
                All Guides
                <span className="text-sm font-normal text-on-surface-variant ml-1">({filtered.length})</span>
              </h2>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                        filter === cat
                          ? "bg-primary text-white shadow-sm"
                          : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {cat === "all" ? "All" : (meta?.label ?? cat)}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-outline-variant p-6 h-52 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-surface-variant mb-4" />
                    <div className="h-5 bg-surface-variant rounded w-3/4 mb-3" />
                    <div className="h-4 bg-surface-variant rounded w-full mb-1" />
                    <div className="h-4 bg-surface-variant rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white border border-outline-variant rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-outline mb-3 block">search_off</span>
                <p className="text-on-surface-variant">No guides match &ldquo;{search}&rdquo;. Try a different keyword.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((guide) => {
                  const meta = CATEGORY_META[guide.category] ?? CATEGORY_META["voting"];
                  const href = SLUG_HREF[guide.slug] ?? `/guides/${guide.slug}`;
                  return (
                    <Link
                      key={guide.id}
                      href={href}
                      className="group bg-white rounded-2xl border border-outline-variant p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meta.bg}`}>
                        <span className={`material-symbols-outlined text-xl ${meta.color}`}>{guide.icon ?? meta.icon}</span>
                      </div>
                      <div className="flex-1">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} mb-2 inline-block`}>
                          {meta.label ?? guide.category}
                        </span>
                        <h3 className="text-base font-semibold text-on-background mb-1.5 group-hover:text-primary transition-colors leading-snug">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                          {guide.bite_summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/60">
                        <span className={`text-xs font-medium ${meta.color} flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[14px]">library_books</span>
                          Full Guide
                        </span>
                        <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── FAQ ─────────────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-bold text-on-background mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">quiz</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-outline-variant rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-semibold text-on-background leading-snug">{faq.q}</span>
                    <span className={`material-symbols-outlined text-primary text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA Banner ───────────────────────────────────────── */}
          <section className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Still have questions?</h3>
              <p className="text-white/80 text-sm">Our AI assistant is trained on official ECI data and can answer election queries instantly.</p>
            </div>
            <Link
              href="/chat"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              Ask AI Now
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
