import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type IndustryItem = { id: string; label: string; copy: string; videos: string[]; order: number };
export type IndustriesSections = {
  hero: { eyebrow?: string; title: string; emphasis?: string; description?: string; ctaLabel?: string };
  introduction: { title: string; description: string; cta: { label: string; href: string } };
  items: IndustryItem[];
};
export type IndustriesContent = CmsDocumentBase & { key: "industries"; seo: SeoFields } & IndustriesSections;
export type PublicIndustries = { page: "industries"; seo: SeoFields; sections: IndustriesSections; updatedAt: string };
