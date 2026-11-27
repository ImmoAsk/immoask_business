"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { loginPath } from "@/lib/auth/redirect";
import { useSessionState } from "../hooks/use_session";

/**
 * Renders its children only for a signed-in user. Without a valid session (never signed in, logged out,
 * token expired or rejected) it sends the visitor to /login, which brings them back here afterwards.
 * The token lives in browser storage, so this check runs on the client.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useSessionState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.replace(loginPath(pathname + window.location.search));
  }, [status, router, pathname]);

  const ready = status === "authenticated";

  // The page keeps the same place in the tree in every state, so it is not remounted once the session is known.
  // While loading (server render and hydration) it is rendered hidden and inert behind the spinner: the server
  // still produces the route's static shell (Next.js validates it), but nothing is shown or reachable.
  // Signed-out visitors never get it: only the spinner, then the redirect.
  return (
    <>
      {ready ? null : (
        <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center bg-zinc-50 dark:bg-zinc-950">
          <span className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-600 dark:border-zinc-700 dark:border-t-brand-400" />
            {status === "loading" ? "Chargement de votre espace…" : "Redirection vers la connexion…"}
          </span>
        </div>
      )}
      <div hidden={!ready} inert={!ready} className={ready ? "contents" : undefined}>
        {status === "unauthenticated" ? null : children}
      </div>
    </>
  );
}
