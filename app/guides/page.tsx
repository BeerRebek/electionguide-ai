"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/shared/Navbar";
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
  { label: string; icon: string; color: string; bg: string }
> = {
  registration: {
    label: "Registration",
    icon: "how_to_reg",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  voting: {
    label: "Voting Day",
    icon: "ballot",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  evm: {
    label: "EVM & VVPAT",
    icon: "how_to_vote",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  candidacy: {
    label: "Candidacy",
    icon: "record_voice_over",
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  grievance: {
    label: "Grievances",
    icon: "report",
    color: "text-red-700",
    bg: "bg-red-50",
  },
  special: {
    label: "NRI & Special",
    icon: "flight",
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  accessibility: {
    label: "Accessibility",
    icon: "accessible",
    color: "text-green-700",
    bg: "bg-green-50",
  },
};

// Slug → internal page route
const SLUG_HREF: Record<string, string> = {
  "voter-registration": "/guides/voter-registration",
  "voting-day": "/guides/voting-day",
  "evm-vvpat": "/guides/evm-vvpat",
  "become-candidate": "/guides/become-candidate",
  "file-complaint": "/guides/file-complaint",
  "nri-voting": "/guides/nri-voting",
  "pwd-voting": "/guides/pwd-voting",
};

// Static fallback so the page works even if DB query fails
const STATIC_GUIDES: Guide[] = [
  {
    id: "1",
    slug: "voter-registration",
    title: "How to Register as a Voter",
    category: "registration",
    bite_summary: "Register online via NVSP or visit your BLO with Form 6.",
    icon: "how_to_reg",
    order_index: 1,
  },
  {
    id: "2",
    slug: "voting-day",
    title: "What to Do on Voting Day",
    category: "voting",
    bite_summary: "Carry your Voter ID to your designated booth before 6 PM.",
    icon: "ballot",
    order_index: 2,
  },
  {
    id: "3",
    slug: "evm-vvpat",
    title: "Understanding EVM & VVPAT",
    category: "evm",
    bite_summary:
      "EVMs are tamper-proof; VVPAT gives you a paper receipt of your vote.",
    icon: "how_to_vote",
    order_index: 3,
  },
  {
    id: "4",
    slug: "become-candidate",
    title: "How to Contest an Election",
    category: "candidacy",
    bite_summary:
      "File Form 2B nomination with ₹25,000 deposit at the RO office.",
    icon: "record_voice_over",
    order_index: 4,
  },
  {
    id: "5",
    slug: "file-complaint",
    title: "How to File an Election Complaint",
    category: "grievance",
    bite_summary: "Report violations via cVIGIL app, 1950 helpline, or ECI.",
    icon: "report",
    order_index: 5,
  },
  {
    id: "6",
    slug: "nri-voting",
    title: "NRI Voting Guide",
    category: "special",
    bite_summary:
      "NRIs can register via Form 6A and must vote in person at their home constituency.",
    icon: "flight",
    order_index: 6,
  },
  {
    id: "7",
    slug: "pwd-voting",
    title: "Voting Rights for Persons with Disabilities",
    category: "accessibility",
    bite_summary:
      "PwD voters get priority access, home voting (85+), and postal ballot options.",
    icon: "accessible",
    order_index: 7,
  },
];

export default function GuidesPage() {
  const supabase = createClient();
  const [guides, setGuides] = useState<Guide[]>(STATIC_GUIDES);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("guides")
        .select("id, slug, title, category, bite_summary, icon, order_index")
        .order("order_index");

      if (data && data.length > 0) {
        setGuides(data as Guide[]);
      } else {
        // Keep static fallback on error or empty
        if (error) console.warn("Guides query failed, using static data:", error.message);
        setGuides(STATIC_GUIDES);
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueCategories = Array.from(new Set(guides.map((g) => g.category)));
  const categories = ["all", ...uniqueCategories];
  const filtered =
    filter === "all" ? guides : guides.filter((g) => g.category === filter);

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-[#F0F4FF] pt-24 pb-16"
      >
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
              <span className="material-symbols-outlined text-primary text-base">
                menu_book
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Voter Education
              </span>
            </div>
            <h1 className="text-4xl font-bold text-on-background mb-2">
              Voter Guides
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Step-by-step guides to help you navigate every part of the Indian
              election process.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    filter === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat === "all" ? "All Guides" : (meta?.label ?? cat)}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-outline-variant p-6 h-52 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-variant mb-4" />
                  <div className="h-5 bg-surface-variant rounded w-3/4 mb-3" />
                  <div className="h-4 bg-surface-variant rounded w-full mb-1" />
                  <div className="h-4 bg-surface-variant rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((guide) => {
                const meta =
                  CATEGORY_META[guide.category] ?? CATEGORY_META["voting"];
                const href =
                  SLUG_HREF[guide.slug] ?? `/guides/${guide.slug}`;

                return (
                  <Link
                    key={guide.id}
                    href={href}
                    className="group bg-white rounded-2xl border border-outline-variant p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${meta.bg}`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${meta.color}`}
                      >
                        {guide.icon ?? meta.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} mb-2 inline-block`}
                      >
                        {meta.label ?? guide.category}
                      </span>
                      <h2 className="text-base font-semibold text-on-background mb-1.5 group-hover:text-primary transition-colors leading-snug">
                        {guide.title}
                      </h2>
                      <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                        {guide.bite_summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/60">
                      <span
                        className={`text-xs font-medium ${meta.color} flex items-center gap-1`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          library_books
                        </span>
                        Full Guide
                      </span>
                      <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
