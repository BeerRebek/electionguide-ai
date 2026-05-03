"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const router = useRouter();

  // Check for valid recovery session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Valid recovery token — user can reset password
      }
    });

    // Check if there's a valid session from the recovery link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // No session means the link is invalid or expired
        // Give a brief delay for the auth state change to fire
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (!s) setTokenError(true);
          });
        }, 2000);
      }
    });
  }, []);

  // Password strength calculation
  const getStrength = (pw: string): { level: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: "Weak", color: "bg-error" };
    if (score <= 2) return { level: 2, label: "Fair", color: "bg-secondary-container" };
    if (score <= 3) return { level: 3, label: "Good", color: "bg-primary-container" };
    return { level: 4, label: "Strong", color: "bg-tertiary-fixed-dim" };
  };

  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to signin after 3 seconds
    setTimeout(() => {
      router.push("/signin?message=Password+reset+successful");
    }, 3000);
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-error-container text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
          </div>
          <h1 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-2">
            Link Expired
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant mb-6">
            This password reset link has expired or is invalid. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center h-[48px] px-6 bg-primary-container text-on-primary rounded-lg text-[14px] font-medium hover:bg-primary-container/90 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[24px] leading-[1.4] font-semibold text-primary"
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              how_to_vote
            </span>
            ElectionGuide AI
          </a>
          <h1 className="text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold text-on-surface mt-6 mb-2">
            Set new password
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant">
            Choose a strong password for your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-tertiary-container text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h2 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-2">
                Password Updated!
              </h2>
              <p className="text-[16px] leading-[1.6] text-on-surface-variant mb-6">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-error-container text-on-error-container rounded-lg text-[14px] leading-[1.4] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">error</span>
                  {error}
                </div>
              )}

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full h-[48px] px-4 pr-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= strength.level ? strength.color : "bg-outline-variant"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[12px] leading-[1.4] ${
                      strength.level <= 1 ? "text-error" : 
                      strength.level <= 2 ? "text-on-surface-variant" : 
                      "text-on-tertiary-container"
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[12px] leading-[1.4] text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || password.length < 8 || password !== confirmPassword}
                className="w-full h-[48px] bg-primary-container text-on-primary rounded-lg text-[14px] leading-[1.4] font-medium hover:bg-primary-container/90 transition-colors shadow-sm active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                    Updating…
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
