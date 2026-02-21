"use client";

/**
 * useCurrentUserProfile – stub hook.
 * Returns a minimal profile object. Replace with real Supabase/API implementation.
 */
export function useCurrentUserProfile() {
    return {
        profile: null as {
            name?: string;
            email?: string;
            avatar_url?: string | null;
            initials?: string;
        } | null,
        isLoading: false,
    };
}
