"use client";

import imageCompression from "browser-image-compression";

import {
  getMediaKind,
  validateMediaFile,
  type MediaKind,
} from "@/lib/media/file-validation";

type PreparedMediaUpload = {
  file: File;
  kind: MediaKind;
};

type PrepareMediaUploadResult =
  | { data: PreparedMediaUpload; error?: never }
  | { data?: never; error: string };

/**
 * Applies the CMS media policy before a file is sent to R2. Images are
 * compressed in the browser; videos are retained as supplied and validated.
 */
export async function prepareMediaUpload(
  sourceFile: File
): Promise<PrepareMediaUploadResult> {
  const kind = getMediaKind(sourceFile.type);

  if (!kind) {
    return {
      error:
        "Choose a JPG, PNG, WebP, AVIF, MP4, MOV, WebM, OGG, AVI, MKV, or 3GP file.",
    };
  }

  let file = sourceFile;

  if (kind === "image") {
    try {
      file = await imageCompression(sourceFile, {
        fileType: sourceFile.type,
        maxSizeMB: 19,
        maxWidthOrHeight: 3840,
        useWebWorker: true,
      });
    } catch {
      return {
        error:
          "We could not compress that image. Please choose another image and try again.",
      };
    }
  }

  const validation = validateMediaFile({ mimeType: file.type, size: file.size });

  if (!validation.valid) {
    return { error: validation.message };
  }

  return { data: { file, kind } };
}
