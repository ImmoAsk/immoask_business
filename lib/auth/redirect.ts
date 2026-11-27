/** Where a signed-in user lands when no (valid) return page is given. */
export const DEFAULT_AFTER_LOGIN = "/app/dashboard";

/** /login URL that returns to `returnTo` after sign-in. */
export function loginPath(returnTo?: string) {
  return returnTo && isSafeReturnPath(returnTo) ? `/login?next=${encodeURIComponent(returnTo)}` : "/login";
}

/** Only back-office paths of this site are accepted, so `?next=` cannot send users to another site. */
export function isSafeReturnPath(path: string) {
  return /^\/app(\/|\?|$)/.test(path) && !path.startsWith("//");
}

/** The `?next=` page of the current URL if it is safe, else `fallback`. Browser only. */
export function returnPathFromLocation(fallback = DEFAULT_AFTER_LOGIN) {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && isSafeReturnPath(next) ? next : fallback;
}
