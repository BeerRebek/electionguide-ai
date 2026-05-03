"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 1. Sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // 2. Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Authentication failed");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    if (!role || !["admin", "super_admin", "content_manager"].includes(role)) {
      // Sign out the non-admin user
      await supabase.auth.signOut();
      setError("Access denied. This portal is restricted to authorized administrators only.");
      setLoading(false);
      return;
    }

    // 3. Set onboarded cookie and redirect to admin
    document.cookie = "onboarded=true; path=/; max-age=3600; samesite=lax";
    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[480px] flex-col justify-between bg-gradient-to-br from-[#0f1729] via-[#162040] to-[#1a2a5e] p-12 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight">ElectionGuide AI</span>
          </div>
          <p className="text-sm text-white/50">Administration Portal</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Secure Admin
            <br />
            Console
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Manage election content, user accounts, analytics, and system
            configuration from a centralized dashboard.
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <span className="material-symbols-outlined text-green-400 text-[18px]">
              verified_user
            </span>
            <span className="text-xs text-white/50">
              Role-verified • Audit-logged • Session-encrypted
            </span>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-white/30">
          © 2026 ElectionGuide AI • Government Authorized Platform
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f9ff]">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <span className="text-xl font-bold text-on-surface">Admin Portal</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-on-surface mb-2">Administrator Sign In</h1>
              <p className="text-sm text-on-surface-variant">
                Enter your credentials to access the admin console.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5">error</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="admin-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@electionguide.ai"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="admin-password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    lock
                  </span>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0f1729] text-white rounded-xl text-sm font-semibold hover:bg-[#1a2a5e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Sign In to Admin Console
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link
                href="/signin"
                className="text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                ← Back to citizen login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
