import type { Metadata } from "next";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import {
  HeroCard,
  QuickActions,
  ElectionJourney,
  CivicFact,
  DailyQuiz,
  RecentNews,
  NotificationsPanel,
  BookmarksPanel,
  TrendingQuestions,
} from "@/components/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — ElectionGuide AI",
  description:
    "Your personal election hub with voter readiness tracking, election countdown, quick actions, and curated civic information.",
};

export default function DashboardPage() {
  return (
    <>
      <SkipToContent />
      <div className="p-6 min-h-screen bg-[#F0F4FF]">
        <div className="max-w-[1200px] mx-auto flex flex-col xl:flex-row gap-6">
          {/* Left / Center Column */}
          <div className="flex-1 flex flex-col gap-6">
            <HeroCard />
            <QuickActions />

            {/* Two-column content */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <ElectionJourney />
              </div>
              <div className="flex flex-col gap-6">
                <CivicFact />
                <DailyQuiz />
                <RecentNews />
              </div>
            </section>
          </div>

          {/* Right Widget Panel */}
          <aside className="w-full xl:w-80 flex flex-col gap-6 flex-shrink-0">
            <NotificationsPanel />
            <BookmarksPanel />
            <TrendingQuestions />
          </aside>
        </div>
      </div>
    </>
  );
}
