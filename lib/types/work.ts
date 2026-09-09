import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type WorkItem = { id: string; title: string; copy: string; videos: string[]; order: number };
export type WorkSections = {
  hero: { eyebrow?: string; title: string; emphasis?: string; description?: string; ctaLabel?: string; aside?: string };
  collection: { eyebrow?: string; title: string; items: WorkItem[] };
  process: { eyebrow?: string; title: string; description?: string; stages: { id: string; title: string; copy: string; order: number }[] };
  faq: { eyebrow?: string; title: string; items: { id: string; question: string; answer: string; order: number }[] };
  invitation: { eyebrow?: string; title: string; description?: string; cta: { label: string; href: string } };
};
export type WorkContent = CmsDocumentBase & { key: "work"; seo: SeoFields } & WorkSections;
export type PublicWork = { page: "work"; seo: SeoFields; sections: WorkSections; updatedAt: string };
