// Backend endpoints. Override with NEXT_PUBLIC_* variables (e.g. in .env.local) to target another environment.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://immoaskprodapi.omnisoft.africa/api/v2";

/** Folder holding user profile pictures. */
export const AVATARS_URL =
  process.env.NEXT_PUBLIC_AVATARS_URL ?? "https://immoaskprodapi.omnisoft.africa/storage/uploads/visuels/avatars";

/** Full URL of a user picture. The backend stores a file name; absolute URLs are returned unchanged. */
export function avatarUrl(avatar: string | null | undefined): string | undefined {
  if (!avatar) return undefined;
  if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith("data:")) return avatar;
  return `${AVATARS_URL.replace(/\/+$/, "")}/${avatar.replace(/^\/+/, "")}`;
}
