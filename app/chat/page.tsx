import type { Metadata } from "next";
import { ChatLayout } from "@/components/features/chat";

export const metadata: Metadata = {
  title: "AI Chat — ElectionGuide AI",
  description:
    "Ask ElectionGuide AI anything about Indian elections, voter registration, EVMs, and your civic rights. Get instant, cited answers in 15 Indian languages.",
};

export default function ChatPage() {
  return <ChatLayout />;
}
