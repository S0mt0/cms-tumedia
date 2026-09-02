import type { CmsDocumentBase } from "@/lib/types/content";

export type MediaKind = "image" | "video";

export type MediaAsset = CmsDocumentBase & {
  key: string;
  url: string;
  kind: MediaKind;
  filename: string;
  mimeType: string;
  size: number;
  folder: "media" | "blogs" | "projects" | "pages";
  alt?: string;
  createdBy: string;
};

export type UploadedMediaAsset = Pick<
  MediaAsset,
  "key" | "url" | "kind" | "filename" | "alt"
> & { id: string };
