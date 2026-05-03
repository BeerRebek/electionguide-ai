"use client";

import Link from "next/link";

const QUIZ_CATEGORIES = [
  { icon: "how_to_vote", title: "EVM & VVPAT", questions: 15, difficulty: "Medium", color: "primary" },
  { icon: "gavel", title: "Constitutional Rights", questions: 20, difficulty: "Hard", color: "secondary" },
  { icon: "campaign", title: "Election Process", questions: 12, difficulty: "Easy", color: "tertiary" },
  { icon: "groups", title: "Candidate Rules", questions: 10, difficulty: "Medium", color: "primary" },
  { icon: "history_edu", title: "Election History", questions: 18, difficulty: "Hard", color: "secondary" },
  { icon: "public", title: "Civic Duties", questions: 8, difficulty: "Easy", color: "tertiary" },
];

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-tertiary-container text-on-tertiary-container",
  Medium: "bg-secondary-fixed text-on-secondary-fixed-variant",
  Hard: "bg-error-container text-on-error-container",
};

export default function QuizPage() {
  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-6 pb-8 md:pb-12 pt-24" role="main">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3 leading-tight">
          Test Your Civic Knowledge
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Challenge yourself with quizzes on Indian elections, constitutional rights, and civic duties. Earn badges and climb the leaderboard!
        </p>
      </div>

      {/* Daily Challenge Banner */}
      <section className="bg-gradient-to-r from-primary-container to-primary rounded-2xl p-8 mb-10 text-on-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-10 -mt-10" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">Daily Challenge</span>
            <h2 className="text-2xl font-semibold mt-3">Constitution Day Special Quiz</h2>
            <p className="text-on-primary/80 mt-1">10 questions • 5 minutes • 500 XP reward</p>
          </div>
          <Link
            href="/quiz/daily/play"
            className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface transition-colors shadow-sm min-h-[48px] flex items-center gap-2"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            Start Challenge
          </Link>
        </div>
      </section>

      {/* Category Grid */}
      <h2 className="text-2xl font-semibold text-on-surface mb-6">Choose a Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {QUIZ_CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={`/quiz/${cat.title.toLowerCase().replace(/\s+/g, "-")}/play`}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${DIFFICULTY_STYLES[cat.difficulty]}`}>
                {cat.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">{cat.title}</h3>
            <p className="text-sm text-on-surface-variant">{cat.questions} questions</p>
            <div className="mt-auto pt-4">
              <span className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Start Quiz <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Your Stats */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">insights</span>
          Your Quiz Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Quizzes Taken", value: "12", icon: "assignment" },
            { label: "Avg Score", value: "78%", icon: "trending_up" },
            { label: "Total XP", value: "2,450", icon: "stars" },
            { label: "Current Streak", value: "5 days", icon: "local_fire_department" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="material-symbols-outlined text-primary text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
