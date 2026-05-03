import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Test Your Knowledge — ElectionGuide AI",
  description: "Take quizzes on Indian elections, constitutional rights, and civic duties. Earn badges and climb the leaderboard!",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToContent />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
