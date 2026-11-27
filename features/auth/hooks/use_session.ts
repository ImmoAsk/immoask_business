"use client";

import { useEffect, useSyncExternalStore } from "react";
import { clearSession, getSession, subscribeSession, type StoredSession } from "@/lib/auth/session";

export type SessionState =
  | { status: "loading"; session: null }
  | { status: "authenticated"; session: StoredSession }
  | { status: "unauthenticated"; session: null };

// Browser storage is unknown on the server and during hydration: `undefined` means "not read yet".
const getServerSnapshot = () => undefined;

/**
 * The signed-in session stored in this browser.
 * `loading` during server rendering and hydration, then `authenticated` / `unauthenticated`.
 * The session is cleared (and the state updated) as soon as its token expires.
 */
export function useSessionState(): SessionState {
  const session = useSyncExternalStore<StoredSession | null | undefined>(subscribeSession, getSession, getServerSnapshot);
  const expiresAt = session?.expiresAt ?? null;

  useEffect(() => {
    if (expiresAt === null) return;
    // setTimeout overflows past ~24.8 days; re-check daily until then.
    const delay = Math.min(Math.max(expiresAt - Date.now(), 0), 24 * 60 * 60 * 1000);
    const timer = window.setTimeout(() => {
      if (Date.now() >= expiresAt) clearSession();
      else getSession();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  if (session === undefined) return { status: "loading", session: null };
  return session ? { status: "authenticated", session } : { status: "unauthenticated", session: null };
}

/** The signed-in session stored in this browser, or null (also null while loading). */
export function useSession(): StoredSession | null {
  return useSessionState().session;
}
