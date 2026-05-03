import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — ElectionGuide AI",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return (
    <div className="p-6 min-h-screen bg-surface">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Settings</h1>
      <p className="text-on-surface-variant">Account settings coming soon.</p>
    </div>
  );
}
