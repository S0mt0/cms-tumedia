export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

/**
 * R2 accepts these common delivery and camera formats. MP4 and WebM remain
 * the best choices for broad playback support on the public website.
 */
export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/ogg",
  "video/x-msvideo",
  "video/x-matroska",
  "video/3gpp",
] as const;
export const ACCEPTED_MEDIA_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
] as const;

export const MAX_MEDIA_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_IMAGE_FILE_SIZE = MAX_MEDIA_FILE_SIZE;
export const MAX_VIDEO_FILE_SIZE = MAX_MEDIA_FILE_SIZE;

export type MediaKind = "image" | "video";

export function getMediaKind(mimeType: string): MediaKind | null {
  if ((IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) return "image";
  if ((VIDEO_MIME_TYPES as readonly string[]).includes(mimeType)) return "video";
  return null;
}

export function validateMediaFile(input: { mimeType: string; size: number }) {
  const kind = getMediaKind(input.mimeType);
  if (!kind)
    return {
      valid: false as const,
      message:
        "Choose a JPG, PNG, WebP, AVIF, MP4, MOV, WebM, OGG, AVI, MKV, or 3GP file.",
    };
  const maximumSize = MAX_MEDIA_FILE_SIZE;
  if (input.size > maximumSize) {
    return { valid: false as const, message: `${kind === "image" ? "Images" : "Videos"} must be ${maximumSize / (1024 * 1024)} MB or smaller.` };
  }
  return { valid: true as const, kind };
}
