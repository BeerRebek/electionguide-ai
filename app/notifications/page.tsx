import type { Metadata } from "next";
import { NotificationsPageClient } from "./NotificationsPageClient";

export const metadata: Metadata = {
  title: "Notifications — ElectionGuide AI",
  description: "Stay up to date with election announcements, reminders, and personalized milestones.",
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
