"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithGoogle } from "@/lib/supabase/actions";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await signUpWithEmail(email, password, fullName);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is required, show a message
    if (data?.user && !data.session) {
      setConfirmSent(true);
      setLoading(false);
      return;
    }

    // If session exists (email confirmation disabled), go to onboarding
    router.push("/onboarding");
  }

  async function handleGoogleSignIn() {
    setError("");
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
    }
  }

  if (confirmSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-tertiary-container text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              mark_email_read
            </span>
          </div>
          <h1 className="text-[32px] leading-[1.3] tracking-[-0.01em] font-semibold text-on-surface mb-2">
            Check your email
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant mb-6">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
            Please verify your email to continue.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center h-[48px] px-6 bg-primary-container text-on-primary rounded-lg text-[14px] font-medium hover:bg-primary-container/90 transition-colors"
          >
            Go to Sign In
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
            Create your account
          </h1>
          <p className="text-[16px] leading-[1.6] text-on-surface-variant">
            Join millions of informed voters
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-[14px] leading-[1.4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">error</span>
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-[48px] rounded-lg border border-outline-variant bg-white text-on-surface flex items-center justify-center gap-3 text-[14px] leading-[1.4] font-medium hover:bg-surface-container-low transition-colors mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="px-4 text-[12px] leading-[1.4] text-outline uppercase">
              Or sign up with email
            </span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="signup-name">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voter@example.com"
                required
                className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-[16px] leading-[1.6] transition-colors hover:border-outline"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] leading-[1.4] tracking-[0.01em] font-medium text-on-surface" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-primary-container text-on-primary rounded-lg text-[14px] leading-[1.4] font-medium hover:bg-primary-container/90 transition-colors shadow-sm active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-[14px] leading-[1.4] text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
