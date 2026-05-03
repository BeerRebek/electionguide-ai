"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FontSizeControls } from "@/components/accessibility/FontSizeControls";
import { ContrastToggle } from "@/components/accessibility/ContrastToggle";
import { LanguageSwitcher } from "@/components/accessibility/LanguageSwitcher";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tc = useTranslations("common");

  const NAV_LINKS = [
    { label: t("timeline"), href: "/timeline" },
    { label: t("guides"), href: "/guides" },
    { label: t("quizzes"), href: "/quiz" },
    { label: t("about"), href: "/#about" },
  ];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "onboarded=; path=/; max-age=0";
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header
      className="bg-white/95 backdrop-blur-md font-sans tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 shadow-sm"
      role="banner"
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary-container flex items-center gap-2"
          aria-label={tc("appName")}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            how_to_vote
          </span>
          {tc("appName")}
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex gap-6 items-center"
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                className={`text-sm px-2 py-1 rounded transition-colors duration-200 ${
                  isActive
                    ? "text-primary-container border-b-2 border-primary-container pb-1 font-medium"
                    : "text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low"
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Dashboard icon — only visible when logged in */}
          {!loading && user && (
            <Link
              href="/dashboard"
              aria-label="Go to Dashboard"
              title="Dashboard"
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                pathname.startsWith("/dashboard")
                  ? "bg-primary-container text-on-primary"
                  : "text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: pathname.startsWith("/dashboard") ? "'FILL' 1" : "'FILL' 0" }}
                aria-hidden="true"
              >
                dashboard
              </span>
              <span className="hidden lg:inline">{t("dashboard")}</span>
            </Link>
          )}
        </nav>

        {/* Right side: Accessibility + Auth */}
        <div className="flex items-center gap-4">
          {/* Accessibility toolbar */}
          <div
            className="hidden md:flex items-center gap-2"
            role="toolbar"
            aria-label="Accessibility tools"
          >
            <LanguageSwitcher />
            <VoiceNarration />
            <ContrastToggle />
            <FontSizeControls />
          </div>

          {/* Auth section */}
          {!loading && (
            <div className="flex gap-2 items-center">
              {user ? (
                /* Logged-in user menu */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-on-surface max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      {userMenuOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-medium text-on-surface">{displayName}</p>
                          <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-slate-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">dashboard</span>
                          {t("dashboard")}
                        </Link>
                        <Link
                          href="/chat"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-slate-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                          {t("chat")}
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            {tc("logout")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Not logged in */
                <>
                  <Link
                    href="/signin"
                    className="hidden md:inline-block px-4 py-2 text-primary-container border border-primary-container rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors"
                  >
                    {tc("signIn")}
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-primary-container text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors shadow-sm active:scale-95 transition-transform"
                  >
                    {tc("signUp")}
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-primary-container"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-4">
          <nav className="flex flex-col gap-3" role="navigation" aria-label="Mobile navigation">
            <Link className="text-primary-container font-medium py-2" href="/timeline">
              {t("timeline")}
            </Link>
            <Link className="text-on-surface-variant py-2" href="/guides">
              {t("guides")}
            </Link>
            <Link className="text-on-surface-variant py-2" href="/quiz">
              {t("quizzes")}
            </Link>
            <Link className="text-on-surface-variant py-2" href="#about">
              {t("about")}
            </Link>
            {user && (
              <Link
                className="flex items-center gap-2 text-primary-container font-semibold py-2 border-t border-slate-100 pt-3"
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                {t("dashboard")}
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-error py-2 text-left font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {tc("logout")}
              </button>
            )}
            {!user && (
              <>
                <Link className="text-primary-container font-medium py-2" href="/signin">
                  {tc("signIn")}
                </Link>
                <Link className="text-primary-container font-medium py-2" href="/signup">
                  {tc("signUp")}
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <LanguageSwitcher />
            <VoiceNarration />
            <ContrastToggle />
            <FontSizeControls />
          </div>
        </div>
      )}
    </header>
  );
}

