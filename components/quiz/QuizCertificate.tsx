"use client";

import { useRef, useCallback } from "react";

interface QuizCertificateProps {
  quizTitle: string;
  category: string;
  score: number;
  total: number;
  onClose: () => void;
}

export function QuizCertificate({ quizTitle, score, total, category, onClose }: QuizCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const pct = Math.round((score / total) * 100);
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const grade =
    pct >= 80 ? "Distinction" :
    pct >= 60 ? "Merit" :
    pct >= 40 ? "Pass" : "Participation";

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    const text = `🏅 I scored ${score}/${total} (${pct}%) on "${quizTitle}" in ElectionGuide AI! #CivicEducation #ElectionGuideAI`;
    if (navigator.share) {
      await navigator.share({ title: "My Quiz Certificate", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  }, [quizTitle, score, total, pct]);

  const gradeColor =
    pct >= 80 ? "#059669" :
    pct >= 60 ? "#2563eb" :
    pct >= 40 ? "#d97706" : "#6b7280";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:bg-transparent print:static print:p-0">
      <div className="w-full max-w-2xl print:max-w-none">
        {/* Action Bar (hidden in print) */}
        <div className="flex justify-between items-center mb-3 print:hidden">
          <h2 className="text-white font-semibold text-sm">Your Certificate of Completion</h2>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share
            </button>
            <button
              onClick={handlePrint}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition"
              aria-label="Close certificate"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div
          ref={certRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {/* Top border decoration */}
          <div className="h-3 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

          <div className="p-8 md:p-12 text-center relative">
            {/* Watermark pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Header */}
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 border-4 border-orange-400 flex items-center justify-center">
                  <span className="text-3xl">🗳️</span>
                </div>
              </div>

              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">ElectionGuide AI</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                Certificate of Completion
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto my-4" />

              <p className="text-gray-500 text-sm mb-6">This is to certify that</p>

              <div className="bg-gray-50 rounded-xl px-8 py-4 inline-block mb-6 border border-gray-100">
                <p className="text-2xl font-bold text-gray-800">A Civic Learner</p>
              </div>

              <p className="text-gray-500 text-sm mb-2">has successfully completed</p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{quizTitle}</h2>
              <p className="text-sm text-gray-500 mb-8">Category: {category}</p>

              {/* Score section */}
              <div className="flex justify-center gap-8 mb-8 flex-wrap">
                <div className="text-center">
                  <div
                    className="text-5xl font-bold mb-1"
                    style={{ color: gradeColor }}
                  >
                    {pct}%
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Score</p>
                </div>
                <div className="w-px bg-gray-200 hidden md:block" />
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800 mb-1">{score}/{total}</div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Correct</p>
                </div>
                <div className="w-px bg-gray-200 hidden md:block" />
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-1 px-4 py-1 rounded-full"
                    style={{ color: gradeColor, backgroundColor: gradeColor + "15" }}
                  >
                    {grade}
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Grade</p>
                </div>
              </div>

              {/* Date & seal row */}
              <div className="flex justify-between items-end border-t border-gray-100 pt-6 flex-wrap gap-4">
                <div className="text-left">
                  <p className="text-xs text-gray-400">Date of Completion</p>
                  <p className="text-sm font-semibold text-gray-700">{today}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center bg-orange-50">
                    <span className="material-symbols-outlined text-2xl text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Official Seal</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Issued by</p>
                  <p className="text-sm font-semibold text-gray-700">ElectionGuide AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-400" />
        </div>
      </div>
    </div>
  );
}
