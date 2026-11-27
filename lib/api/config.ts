// Backend endpoints. Override with NEXT_PUBLIC_* variables (e.g. in .env.local) to target another environment.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://immoaskprodapi.omnisoft.africa/api/v2";

/** Folder holding user profile pictures. */
export const AVATARS_URL =
  process.env.NEXT_PUBLIC_AVATARS_URL ?? "https://immoaskprodapi.omnisoft.africa/storage/uploads/visuels/avatars";

/** Folder holding property pictures and videos ("visuels"). */
export const PROPERTY_VISUALS_URL =
  process.env.NEXT_PUBLIC_PROPERTY_VISUALS_URL ?? "https://immoaskprodapi.omnisoft.africa/storage/uploads/visuels/proprietes";

/** Joins a stored file name to its folder; absolute and data URLs are returned unchanged. */
function storageUrl(folder: string, file: string | null | undefined): string | undefined {
  if (!file) return undefined;
  if (/^(https?:)?\/\//.test(file) || file.startsWith("data:")) return file;
  return `${folder.replace(/\/+$/, "")}/${file.replace(/^\/+/, "")}`;
}

/**
 * Shareable URL of a property picture, e.g.
 * "J2wJiCMBc8CC5om0GbDOtXPH4YXL0OREVTyRlaQl.jpg" → ".../storage/uploads/visuels/proprietes/J2wJ….jpg".
 */
export function propertyPhotoUrl(file: string | null | undefined): string | undefined {
  return storageUrl(PROPERTY_VISUALS_URL, file);
}

/** Full URL of a user picture. The backend stores a file name; absolute URLs are returned unchanged. */
export function avatarUrl(avatar: string | null | undefined): string | undefined {
  return storageUrl(AVATARS_URL, avatar);
}
