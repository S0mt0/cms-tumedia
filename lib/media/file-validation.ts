export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const VIDEO_MIME_TYPES = ["video/mp4"] as const;
export const ACCEPTED_MEDIA_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
] as const;

export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;

export type MediaKind = "image" | "video";

export function getMediaKind(mimeType: string): MediaKind | null {
  if ((IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) return "image";
  if ((VIDEO_MIME_TYPES as readonly string[]).includes(mimeType)) return "video";
  return null;
}

export function validateMediaFile(input: { mimeType: string; size: number }) {
  const kind = getMediaKind(input.mimeType);
  if (!kind) return { valid: false as const, message: "Choose a JPG, PNG, WebP, AVIF, or MP4 file." };
  const maximumSize = kind === "image" ? MAX_IMAGE_FILE_SIZE : MAX_VIDEO_FILE_SIZE;
  if (input.size > maximumSize) {
    return { valid: false as const, message: `${kind === "image" ? "Images" : "Videos"} must be ${maximumSize / (1024 * 1024)} MB or smaller.` };
  }
  return { valid: true as const, kind };
}
