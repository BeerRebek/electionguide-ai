import type { Metadata } from "next";
import { NotificationSettingsClient } from "./NotificationSettingsClient";

export const metadata: Metadata = {
  title: "Notification Settings — ElectionGuide AI",
  description: "Manage your notification preferences, channels, and quiet hours.",
};

export default function NotificationSettingsPage() {
  return <NotificationSettingsClient />;
}
