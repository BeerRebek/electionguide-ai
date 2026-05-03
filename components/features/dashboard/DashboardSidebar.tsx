"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/accessibility/LanguageSwitcher";

export function DashboardSidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Citizen User");
  const [email, setEmail] = useState("");

  const NAV_CATEGORIES = [
    {
      title: t("categories.main"),
      items: [
        { icon: "dashboard", label: t("dashboard"), href: "/dashboard" },
        { icon: "smart_toy", label: t("aiAssistant"), href: "/chat" },
        { icon: "timeline", label: t("timeline"), href: "/timeline" },
      ],
    },
    {
      title: t("categories.resources"),
      items: [
        { icon: "menu_book", label: t("guides"), href: "/guides" },
        { icon: "database", label: t("knowledgeBase"), href: "/knowledge-base" },
        { icon: "newspaper", label: t("electionNews"), href: "/news" },
      ],
    },
    {
      title: t("categories.tools"),
      items: [
        { icon: "where_to_vote", label: t("boothFinder"), href: "/booth-finder" },
        { icon: "how_to_reg", label: t("voterPortal"), href: "/registration" },
        { icon: "lock", label: t("digitalLocker"), href: "/profile/documents" },
      ],
    },
    {
      title: t("categories.support"),
      items: [
        { icon: "quiz", label: t("civicEducation"), href: "/quiz" },
        { icon: "support_agent", label: t("grievanceCell"), href: "/support" },
        { icon: "settings", label: t("settings"), href: "/profile/settings" },
      ],
    },
  ];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setDisplayName(
          data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Citizen User"
        );
        setEmail(data.user.email || "");
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "onboarded=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }

  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav
      className="fixed left-0 top-0 h-full w-72 border-r hidden lg:flex flex-col bg-surface-container-lowest border-outline-variant shadow-sm z-40"
      aria-label="Dashboard navigation"
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* User Profile Header */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-lg font-bold shadow-md transform rotate-3 hover:rotate-0 transition-transform">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-on-surface truncate">{displayName}</h2>
              <p className="text-xs text-on-surface-variant truncate opacity-80">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {/* Language Switcher Card */}
          <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">language</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t("categories.support")}</span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Categories */}
          {NAV_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 opacity-60">
                {category.title}
              </h3>
              <div className="space-y-0.5">
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${
                          isActive ? "fill-1" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm tracking-tight">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low/50 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 text-on-surface-variant px-3 py-2.5 hover:bg-surface-container rounded-xl transition-all w-full group"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">home</span>
            <span className="text-sm font-medium">{t("backToHome")}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-error px-3 py-2.5 hover:bg-error-container/10 rounded-xl transition-all w-full group"
          >
            <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">logout</span>
            <span className="text-sm font-bold">{t("signOut")}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

