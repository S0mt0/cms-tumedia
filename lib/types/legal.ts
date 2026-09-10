import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type LegalDocument = { title: string; updatedLabel: string; content: string };
export type LegalContent = CmsDocumentBase & { key: "legal"; seo: SeoFields; terms: LegalDocument; privacy: LegalDocument };
export type PublicLegal = { page: "legal"; seo: SeoFields; sections: { terms: LegalDocument; privacy: LegalDocument }; updatedAt: string };
