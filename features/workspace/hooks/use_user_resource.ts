"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/features/auth/hooks/use_session";
import type { ScopedUser } from "@/lib/api/shared/roles";

export type UserResource<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Loads something that depends on the signed-in user (their role decides the query's filters).
 * `load` must be stable (a module-level function); it is re-run when the user or role changes.
 */
export function useUserResource<T>(
  load: (user: ScopedUser) => Promise<T>,
): UserResource<T> {
  const session = useSession();
  const userId = session?.user.id ?? null;
  const roleId = session?.user.role?.id ?? null;
  const roleName = session?.user.role?.name ?? null;
  const key = userId === null ? null : `${userId}:${roleId ?? ""}`;
  const [state, setState] = useState<UserResource<T> & { key: string | null }>({
    key: null,
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (userId === null) return;
    let cancelled = false;
    const user: ScopedUser = {
      id: userId,
      role: roleId === null ? null : { id: roleId, name: roleName },
    };
    load(user)
      .then(
        (data) =>
          !cancelled &&
          setState({
            key: `${userId}:${roleId ?? ""}`,
            data,
            isLoading: false,
            error: null,
          }),
      )
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          key: `${userId}:${roleId ?? ""}`,
          data: null,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Erreur de chargement",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [load, userId, roleId, roleName]);

  // Until the current user's answer arrives, show loading rather than another user's data.
  if (state.key !== key) return { data: null, isLoading: true, error: null };
  return { data: state.data, isLoading: state.isLoading, error: state.error };
}
