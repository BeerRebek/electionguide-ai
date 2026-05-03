"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Profile } from "@/types";

/**
 * Returns the current user's profile data with loading state.
 * Supports optimistic updates and refetching.
 */
export function useProfile() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProfile(data as unknown as Profile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!userLoading) fetchProfile();
  }, [userLoading, fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user) return;

      // Optimistic update
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (updateError) {
        // Revert on error
        await fetchProfile();
        throw new Error(updateError.message);
      }
    },
    [user, fetchProfile]
  );

  return { profile, loading: userLoading || loading, error, updateProfile, refetch: fetchProfile };
}
