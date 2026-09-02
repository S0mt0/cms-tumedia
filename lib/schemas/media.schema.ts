import { z } from "zod";

import {
  ACCEPTED_MEDIA_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  getMediaKind,
} from "@/lib/media/file-validation";

export const mediaFolderSchema = z.enum([
  "media",
  "blogs",
  "projects",
  "pages",
]);

export const presignUploadSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  mimeType: z.enum(ACCEPTED_MEDIA_MIME_TYPES),
  size: z
    .number()
    .int()
    .positive()
    .max(MAX_VIDEO_FILE_SIZE),
  folder: mediaFolderSchema,
}).superRefine((value, context) => {
  if (getMediaKind(value.mimeType) === "image" && value.size > MAX_IMAGE_FILE_SIZE) {
    context.addIssue({ code: "custom", path: ["size"], message: "Images must be 10 MB or smaller." });
  }
});
