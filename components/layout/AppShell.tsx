"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/accessibility/LanguageSwitcher";

/* ─────────────────────────────────────────────
   Navigation definition (matches the screenshot)
───────────────────────────────────────────── */
const NAV = [
  {
    group: "MAIN",
    items: [
      { icon: "dashboard",   label: "Dashboard",        href: "/dashboard" },
      { icon: "smart_toy",   label: "AI Assistant",     href: "/chat" },
      { icon: "timeline",    label: "Election Timeline", href: "/timeline" },
    ],
  },
  {
    group: "RESOURCES",
    items: [
      { icon: "menu_book",   label: "Guides",           href: "/guides" },
      { icon: "database",    label: "Knowledge Base",   href: "/knowledge-base" },
      { icon: "newspaper",   label: "Election News",    href: "/news" },
    ],
  },
  {
    group: "TOOLS",
    items: [
      { icon: "where_to_vote", label: "Booth Finder",  href: "/booth-finder" },
      { icon: "how_to_reg",    label: "Voter Portal",  href: "/registration" },
      { icon: "lock",          label: "Digital Locker",href: "/profile/documents" },
    ],
  },
];

/* Mobile bottom-nav shows the 5 most important destinations */
const MOBILE_NAV = [
  { icon: "dashboard",    label: "Home",      href: "/dashboard" },
  { icon: "smart_toy",    label: "AI Chat",   href: "/chat" },
  { icon: "database",     label: "Knowledge", href: "/knowledge-base" },
  { icon: "where_to_vote",label: "Booth",     href: "/booth-finder" },
  { icon: "menu_book",    label: "Guides",    href: "/guides" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Citizen User");
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setDisplayName(
          data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "Citizen User"
        );
        setEmail(data.user.email || "");
      }
    });
  }, []);

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "onboarded=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }

  const initials = displayName.charAt(0).toUpperCase();

  /* Is this path active (also matches sub-paths like /guides/voter-reg) */
  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  /* ── Sidebar content (shared by desktop + mobile drawer) ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* User profile */}
      <div className="p-5 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-base font-bold shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
            <p className="text-[11px] text-on-surface-variant truncate opacity-80">{email}</p>
          </div>
        </div>
      </div>

      {/* Language + Support pill */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">language</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Support</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-5" aria-label="App navigation">
        {NAV.map((group) => (
          <div key={group.group} className="space-y-0.5">
            <p className="px-3 mb-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.18em] opacity-60">
              {group.group}
            </p>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[21px] transition-transform group-hover:scale-105 ${
                      active ? "" : ""
                    }`}
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-low/60 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group w-full"
        >
          <span className="material-symbols-outlined text-[21px] group-hover:text-primary transition-colors">home</span>
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error-container/10 transition-all w-full group"
        >
          <span className="material-symbols-outlined text-[21px] group-hover:scale-110 transition-transform">logout</span>
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex pt-16 bg-surface-container-lowest">

      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 border-r border-outline-variant bg-surface-container-lowest shadow-sm z-40 hidden lg:flex flex-col"
        aria-label="Sidebar navigation"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer overlay ───────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 h-full w-[280px] z-50 flex flex-col bg-surface-container-lowest shadow-2xl lg:hidden animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <div className="flex items-center justify-between p-4 pt-5 border-b border-outline-variant">
              <span className="text-sm font-bold text-on-surface">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}

      {/* ── Mobile header hamburger (visible only on mobile) ─ */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-[70px] left-3 z-30 lg:hidden w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant shadow-sm flex items-center justify-center hover:bg-surface-container transition-colors"
        aria-label="Open navigation menu"
      >
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">menu</span>
      </button>

      {/* ── Main content area ───────────────────────────────── */}
      <main
        id="main-content"
        className="flex-1 lg:ml-72 min-h-screen pb-20 lg:pb-0"
      >
        {children}
      </main>

      {/* ── Mobile Bottom Navigation Bar ───────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around py-2 px-1">
          {MOBILE_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] transition-transform"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={`text-[9px] font-semibold tracking-tight ${active ? "text-primary" : ""}`}>
                  {item.label}
                </span>
                {active && <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
