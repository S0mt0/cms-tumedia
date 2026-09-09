import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type ServiceItem = { id: string; title: string; tagline: string; copy: string; details: string[]; order: number };
export type ServiceStep = { id: string; title: string; copy: string; order: number };
export type ServiceFaqItem = { id: string; question: string; answer: string; order: number };
export type ServicesSections = {
  hero: { eyebrow?: string; title: string; emphasis?: string; description?: string; exploreLabel?: string; contactLabel?: string };
  overview: { title: string; description: string; items: Pick<ServiceItem, "id" | "title" | "tagline" | "copy" | "order">[] };
  system: { eyebrow?: string; title: string; description: string; needs: Pick<ServiceItem, "id" | "title" | "copy" | "order">[] };
  deepDives: { items: ServiceItem[] };
  process: { title: string; description: string; steps: ServiceStep[] };
  industries: { title: string; description: string };
  faq: { eyebrow?: string; title: string; items: ServiceFaqItem[] };
  closing: { title: string; description: string; primaryLabel?: string; secondaryLabel?: string };
};
export type ServicesContent = CmsDocumentBase & { key: "services"; seo: SeoFields; } & ServicesSections;
export type PublicServices = { page: "services"; seo: SeoFields; sections: ServicesSections; updatedAt: string };
