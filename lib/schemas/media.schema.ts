import { z } from "zod";

import {
  ACCEPTED_MEDIA_MIME_TYPES,
  MAX_MEDIA_FILE_SIZE,
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
  size: z.number().int().positive().max(MAX_MEDIA_FILE_SIZE),
  folder: mediaFolderSchema,
});
