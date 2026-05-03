"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QuizCertificate } from "@/components/quiz/QuizCertificate";

// ── Static quiz data (replace with DB fetch in production) ──
const QUIZ_DATA: Record<string, {
  title: string;
  category: string;
  timePerQuestion: number;
  questions: { q: string; options: string[]; correct: number; explanation: string }[];
}> = {
  "evm-&-vvpat": {
    title: "EVM & VVPAT",
    category: "Technology",
    timePerQuestion: 30,
    questions: [
      { q: "What does EVM stand for?", options: ["Electronic Voting Machine", "Electoral Verification Module", "Electronic Voter Management", "Election Vote Meter"], correct: 0, explanation: "EVM stands for Electronic Voting Machine — used in Indian elections since 1999 in phases." },
      { q: "VVPAT was first used in which Indian election?", options: ["2009 Lok Sabha", "2013 Nagaland Assembly", "2014 Lok Sabha", "2019 Lok Sabha"], correct: 1, explanation: "VVPAT was piloted in the 2013 Nagaland Assembly elections before a national rollout." },
      { q: "How many seconds does a VVPAT slip remain visible?", options: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"], correct: 2, explanation: "The VVPAT slip is visible for 7 seconds so voters can verify their vote." },
      { q: "Who manufactures EVMs in India?", options: ["ISRO", "DRDO", "BEL & ECIL", "HCL Technologies"], correct: 2, explanation: "EVMs are manufactured by BEL and ECIL under ECI oversight." },
      { q: "Maximum candidates an EVM ballot unit can accommodate?", options: ["16", "32", "64", "384"], correct: 3, explanation: "Up to 384 candidates can be accommodated by linking 6 units (64 per unit)." },
    ],
  },
  "constitutional-rights": {
    title: "Constitutional Rights",
    category: "Civics",
    timePerQuestion: 45,
    questions: [
      { q: "Which Article grants the right to vote?", options: ["Article 19", "Article 21", "Article 326", "Article 324"], correct: 2, explanation: "Article 326 grants the right to vote to every citizen of India above 18 years." },
      { q: "The right to vote in India is a:", options: ["Fundamental Right", "Legal Right", "Constitutional Right", "Natural Right"], correct: 1, explanation: "The Supreme Court held that the right to vote is a statutory / legal right." },
      { q: "Which Amendment lowered voting age from 21 to 18?", options: ["42nd", "61st", "73rd", "86th"], correct: 1, explanation: "The 61st Constitutional Amendment (1988) lowered the voting age to 18 years." },
    ],
  },
  "election-process": {
    title: "Election Process",
    category: "Civics",
    timePerQuestion: 30,
    questions: [
      { q: "Who conducts Lok Sabha elections in India?", options: ["President of India", "Election Commission of India", "Supreme Court", "Parliament"], correct: 1, explanation: "The Election Commission of India (ECI) is a constitutional body for conducting elections." },
      { q: "Model Code of Conduct comes into effect from:", options: ["Date of notification", "Date of announcement", "30 days before polling", "15 days before polling"], correct: 1, explanation: "The MCC comes into force immediately from the date the election schedule is announced." },
    ],
  },
};

const DEFAULT_QUIZ = {
  title: "General Elections Quiz",
  category: "General",
  timePerQuestion: 30,
  questions: [
    { q: "In which year was the first general election held in India?", options: ["1947", "1950", "1951–52", "1957"], correct: 2, explanation: "India's first general election was held from October 1951 to February 1952." },
  ],
};

type QuizState = "intro" | "playing" | "result";

function launchConfetti() {
  // Simple CSS-based confetti via DOM manipulation (avoids canvas-confetti SSR issues)
  if (typeof window === "undefined") return;
  const colors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = Math.random() * 2 + 2;
    piece.style.cssText = `
      position:absolute;top:-20px;left:${left}%;
      width:${size}px;height:${size}px;
      background:${color};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      animation:fall ${duration}s ease-in ${delay}s forwards;
      transform:rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(piece);
  }

  // Add keyframes
  if (!document.getElementById("confetti-style")) {
    const style = document.createElement("style");
    style.id = "confetti-style";
    style.textContent = `@keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`;
    document.head.appendChild(style);
  }

  setTimeout(() => document.body.removeChild(container), 5000);
}

export default function QuizPlayPage() {
  const params = useParams();
  const quizId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const quiz = QUIZ_DATA[quizId] ?? DEFAULT_QUIZ;

  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timePerQuestion);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showCert, setShowCert] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);

  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) setScore((s) => s + 1);
  }, [answered, question]);

  const handleNext = useCallback(() => {
    setAnswers((prev) => [...prev, selected]);
    if (currentQ + 1 >= total) {
      setState("result");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(quiz.timePerQuestion);
    }
  }, [currentQ, selected, total, quiz.timePerQuestion]);

  // Timer
  useEffect(() => {
    if (state !== "playing" || answered) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [state, answered, timeLeft, handleAnswer]);

  // Fire confetti on high score
  useEffect(() => {
    if (state === "result" && !confettiFired) {
      const pct = Math.round((score / total) * 100);
      if (pct >= 60) {
        launchConfetti();
        setConfettiFired(true);
      }
    }
  }, [state, score, total, confettiFired]);

  const pct = Math.round((score / total) * 100);
  const grade =
    pct >= 80 ? { label: "Excellent!", color: "text-tertiary", icon: "emoji_events", xp: total * 100 } :
    pct >= 50 ? { label: "Good Effort", color: "text-primary", icon: "thumb_up", xp: total * 60 } :
    { label: "Keep Learning", color: "text-error", icon: "school", xp: total * 20 };

  const handleShareResult = async () => {
    const text = `I scored ${score}/${total} (${pct}%) on "${quiz.title}" in ElectionGuide AI! 🗳️ #CivicEducation`;
    if (navigator.share) {
      await navigator.share({ title: "My Quiz Result", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0); setScore(0); setAnswers([]); setSelected(null);
    setAnswered(false); setTimeLeft(quiz.timePerQuestion);
    setConfettiFired(false);
    setState("playing");
  };

  // ── INTRO ──
  if (state === "intro") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 pt-28 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-6 shadow-md">
          <span className="material-symbols-outlined text-4xl text-on-primary-container">quiz</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">{quiz.title}</h1>
        <p className="text-on-surface-variant mb-4">{quiz.category} · {total} questions · {quiz.timePerQuestion}s per question</p>
        <div className="flex gap-3 mt-2 mb-8 flex-wrap justify-center">
          <span className="bg-surface-container px-3 py-1 rounded-full text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">timer</span> {quiz.timePerQuestion}s/question
          </span>
          <span className="bg-surface-container px-3 py-1 rounded-full text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">stars</span> Up to {total * 100} XP
          </span>
          <span className="bg-surface-container px-3 py-1 rounded-full text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span> Certificate on completion
          </span>
        </div>
        <button
          onClick={() => setState("playing")}
          className="bg-primary text-on-primary px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center gap-2 shadow-md"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          Start Quiz
        </button>
        <Link href="/quiz" className="mt-6 text-sm text-on-surface-variant hover:text-primary transition">
          ← Back to all quizzes
        </Link>
      </main>
    );
  }

  // ── RESULT ──
  if (state === "result") {
    return (
      <>
        {showCert && (
          <QuizCertificate
            quizTitle={quiz.title}
            category={quiz.category}
            score={score}
            total={total}
            onClose={() => setShowCert(false)}
          />
        )}
        <main className="max-w-2xl mx-auto px-6 py-16 pt-28">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <span className={`material-symbols-outlined text-6xl ${grade.color} mb-4 block`} style={{ fontVariationSettings: "'FILL' 1" }}>{grade.icon}</span>
              <h1 className="text-3xl font-bold text-on-surface mb-1">{grade.label}</h1>
              <p className="text-on-surface-variant">You scored <span className="font-semibold text-on-surface">{score} out of {total}</span></p>
            </div>

            {/* Score ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--md-sys-color-surface-container)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--md-sys-color-primary)" strokeWidth="12"
                  strokeLinecap="round" strokeDasharray={`${pct * 3.14} 314`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-on-surface">{pct}%</span>
              </div>
            </div>

            {/* XP earned */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-full text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                +{grade.xp} XP earned
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center flex-wrap mb-8">
              <button
                onClick={() => setShowCert(true)}
                className="bg-primary text-on-primary px-5 py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined">workspace_premium</span> Get Certificate
              </button>
              <button
                onClick={handleShareResult}
                className="bg-surface-container border border-outline-variant text-on-surface px-5 py-3 rounded-xl font-medium hover:bg-surface-container-high transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined">share</span> Share Result
              </button>
              <button
                onClick={handleRestart}
                className="bg-surface-container border border-outline-variant text-on-surface px-5 py-3 rounded-xl font-medium hover:bg-surface-container-high transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined">replay</span> Retry
              </button>
              <Link href="/quiz" className="bg-surface-container border border-outline-variant text-on-surface px-5 py-3 rounded-xl font-medium hover:bg-surface-container-high transition flex items-center gap-2">
                <span className="material-symbols-outlined">grid_view</span> All Quizzes
              </Link>
            </div>

            {/* Answer Review */}
            <div className="text-left space-y-3">
              <h2 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">rate_review</span>
                Question Review
              </h2>
              {quiz.questions.map((q, i) => {
                const userAns = answers[i] ?? -1;
                const correct = userAns === q.correct;
                return (
                  <div key={i} className={`p-4 rounded-xl border ${correct ? "bg-tertiary-container/20 border-tertiary-container" : "bg-error-container/20 border-error-container"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${correct ? "bg-tertiary text-on-tertiary" : "bg-error text-on-error"}`}>
                        {correct ? "✓" : "✗"}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-on-surface mb-1">{i + 1}. {q.q}</p>
                        {!correct && (
                          <p className="text-xs text-on-surface-variant mb-1">
                            Your answer: <span className="text-error font-medium">{userAns === -1 ? "Time expired" : q.options[userAns]}</span>
                            {" · "}Correct: <span className="text-tertiary font-medium">{q.options[q.correct]}</span>
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── PLAYING ──
  const timerPct = (timeLeft / quiz.timePerQuestion) * 100;

  return (
    <main className="max-w-2xl mx-auto px-6 py-8 pt-28">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentQ / total) * 100}%` }} />
        </div>
        <span className="text-sm font-medium text-on-surface-variant whitespace-nowrap">{currentQ + 1} / {total}</span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${timerPct < 33 ? "bg-error" : timerPct < 66 ? "bg-secondary" : "bg-tertiary"}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
        <span className={`text-sm font-mono font-bold tabular-nums ${timerPct < 33 ? "text-error" : "text-on-surface-variant"}`}>{timeLeft}s</span>
      </div>

      {/* Question card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm mb-6">
        <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-4">{quiz.category} · Q{currentQ + 1}</p>
        <h2 className="text-xl font-semibold text-on-surface mb-8 leading-snug">{question.q}</h2>

        <div className="space-y-3">
          {question.options.map((opt, i) => {
            let style = "bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high hover:border-primary";
            if (answered) {
              if (i === question.correct) style = "bg-tertiary-container border-tertiary-container text-on-tertiary-container";
              else if (i === selected) style = "bg-error-container border-error-container text-on-error-container";
              else style = "bg-surface-container border-outline-variant text-on-surface-variant opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all text-sm flex items-center gap-3 ${style}`}
              >
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${answered && i === question.correct ? "bg-tertiary border-tertiary text-on-tertiary" : "border-current"}`}>
                  {answered && i === question.correct ? "✓" : answered && i === selected ? "✗" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 p-4 bg-primary-container/30 rounded-xl border border-primary-container">
            <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span> Explanation
            </p>
            <p className="text-sm text-on-surface-variant">{question.explanation}</p>
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-base hover:opacity-90 transition flex items-center justify-center gap-2 shadow"
        >
          {currentQ + 1 >= total ? (
            <><span className="material-symbols-outlined">flag</span> See Results</>
          ) : (
            <><span className="material-symbols-outlined">arrow_forward</span> Next Question</>
          )}
        </button>
      )}
    </main>
  );
}
