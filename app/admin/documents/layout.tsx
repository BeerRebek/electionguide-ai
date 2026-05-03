import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin — Document Manager | ElectionGuide AI",
  description: "Manage the RAG knowledge base for ElectionGuide AI",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
