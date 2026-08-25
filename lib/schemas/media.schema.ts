import { z } from "zod";

export const mediaFolderSchema = z.enum([
  "media",
  "blogs",
  "projects",
  "pages",
]);

export const presignUploadSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  mimeType: z.enum([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
    "video/mp4",
  ]),
  size: z
    .number()
    .int()
    .positive()
    .max(100 * 1024 * 1024),
  folder: mediaFolderSchema,
});
