"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAdminNavItems, ROLE_LABELS, ROLE_COLORS, type UserRole } from "@/lib/admin/rbac";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setDisplayName(
          data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Admin"
        );
        setEmail(data.user.email || "");

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile) setRole(profile.role as UserRole);
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "onboarded=; path=/; max-age=0";
    router.push("/admin/signin");
  }

  const navItems = getAdminNavItems(role);
  const initials = displayName.charAt(0).toUpperCase();
  const roleStyle = ROLE_COLORS[role];

  return (
    <nav
      className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col bg-[#0f1729] text-white z-40"
      aria-label="Admin navigation"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight block">ElectionGuide AI</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Admin Console</span>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white/90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">switch_account</span>
            Citizen View
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
