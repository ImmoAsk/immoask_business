import type { AuthUser } from "@/features/auth/types";

/**
 * Browser-side session persistence.
 * "Remember me" → localStorage (survives browser restarts); otherwise sessionStorage (cleared when the tab closes).
 * The session is dropped once `expiresAt` is passed, or on logout.
 */

const SESSION_KEY = "immoask.session";

export type StoredSession = {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  /** Epoch milliseconds, or null when the backend gave no expiry. */
  expiresAt: number | null;
  user: AuthUser;
};

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function storages(): Storage[] {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

export function saveSession(session: StoredSession, { remember }: { remember: boolean }) {
  for (const storage of storages()) storage.removeItem(SESSION_KEY);
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  notify();
}

// Last parsed value, so repeated reads of the same stored string return the same object (useSyncExternalStore needs it).
let cache: { raw: string; session: StoredSession } | null = null;

/** Returns the stored session if one exists and has not expired (an expired one is removed). */
export function getSession(): StoredSession | null {
  for (const storage of storages()) {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) continue;
    try {
      const session = cache?.raw === raw ? cache.session : (JSON.parse(raw) as StoredSession);
      if (session.expiresAt !== null && Date.now() >= session.expiresAt) {
        storage.removeItem(SESSION_KEY);
        return null;
      }
      cache = { raw, session };
      return session;
    } catch {
      storage.removeItem(SESSION_KEY);
    }
  }
  return null;
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function clearSession() {
  for (const storage of storages()) storage.removeItem(SESSION_KEY);
  cache = null;
  notify();
}

/** Subscribes to session changes in this tab (login / logout) and in other tabs (storage event). */
export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SESSION_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
