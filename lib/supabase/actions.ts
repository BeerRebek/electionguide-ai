import { createClient } from "@/lib/supabase/client";
import { OnboardingState } from "@/lib/stores/onboarding-store";

/**
 * Sync onboarding data from Zustand to Supabase profiles table.
 * Called on "Complete Setup" in step 4.
 */
export async function syncOnboardingToProfile(state: OnboardingState) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.warn("No authenticated user — skipping profile sync");
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      language_pref: state.language,
      state: state.location.state,
      district: state.location.district,
      constituency: state.location.constituency,
      pin_code: state.location.pinCode,
      age_range: state.profile.ageRange || null,
      voter_status: state.profile.voterStatus || null,
      interests: state.profile.interests,
      notification_preferences: {
        election_reminders: state.notifications.electionReminders,
        voter_guides: state.notifications.voterGuides,
        daily_quiz: state.notifications.dailyQuiz,
        local_news: state.notifications.localNews,
        weekly_digest: state.notifications.weeklyDigest,
        push_enabled: state.notifications.pushEnabled,
      },
      onboarded: true,
      onboarding_step: 5,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile sync failed:", error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Sign up with email and password.
 * After signup, the Supabase trigger auto-creates a profile row.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/onboarding`,
    },
  });

  return { data, error };
}

/**
 * Send password reset email.
 */
export async function resetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/signin`,
  });

  return { error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Send OTP to phone number (requires Supabase Phone provider config).
 * Phone format: +91XXXXXXXXXX
 */
export async function signInWithPhone(phone: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  return { data, error };
}

/**
 * Verify OTP code sent to phone.
 */
export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  return { data, error };
}

/**
 * Set locale cookie for next-intl.
 * Call this when user changes language in LanguageSwitcher or onboarding.
 */
export function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}
