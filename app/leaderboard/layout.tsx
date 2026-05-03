import { Navbar } from "@/components/shared/Navbar";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { AppShell } from "@/components/layout/AppShell";

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToContent />
      <Navbar />
      <AppShell>{children}</AppShell>
    </>
  );
}
