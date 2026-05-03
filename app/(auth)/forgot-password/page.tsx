"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/supabase/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
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
          </Link>
          <h1 className="text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold text-on-surface mt-6 mb-2">
            Reset your password
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          {sent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-tertiary-container text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  mark_email_read
                </span>
              </div>
              <h2 className="text-[24px] leading-[1.4] font-semibold text-on-surface mb-2">
                Check your email
              </h2>
              <p className="text-[16px] leading-[1.6] text-on-surface-variant mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center h-[48px] px-6 bg-primary-container text-on-primary rounded-lg text-[14px] font-medium hover:bg-primary-container/90 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-error-container text-on-error-container rounded-lg text-[14px] leading-[1.4] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">error</span>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="forgot-email">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voter@example.com"
                  required
                  className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-primary-container text-on-primary rounded-lg text-[14px] leading-[1.4] font-medium hover:bg-primary-container/90 transition-colors shadow-sm active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <p className="text-center mt-4 text-[14px] leading-[1.4] text-on-surface-variant">
                Remember your password?{" "}
                <Link href="/signin" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
