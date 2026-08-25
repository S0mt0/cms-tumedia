import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type CtaContent = { label: string; href: string };
export type MediaRef = { url: string; alt: string };
export type LandingSections = {
  hero: { eyebrow: string; title: string; emphasis: string; description: string; primaryCta: CtaContent; secondaryCta: CtaContent; backgroundMedia: MediaRef; scrollLabel: string };
  positioning: { title: string; description: string; cta: CtaContent; stats: { id: string; value: string; label: string; order: number }[]; marqueeItems: { id: string; label: string; order: number }[] };
  process: { eyebrow: string; title: string; description: string; cta: CtaContent; media: MediaRef; imageWordmark: string; steps: { id: string; title: string; order: number }[] };
  creatorFlowCta: { eyebrow: string; title: string; emphasis: string; description: string; cta: CtaContent; media: MediaRef; mediaCaption: string };
  industriesPreview: { eyebrow: string; title: string; description: string; items: { id: string; label: string; href: string; image: MediaRef; order: number }[] };
  videoShowcase: { eyebrow: string; title: string; emphasis: string; description: string; cta: CtaContent; youtubeUrl: string; videoTitle: string };
  whyTuMedia: { eyebrow: string; title: string; emphasis: string; description: string; media: MediaRef; items: { id: string; text: string; order: number }[] };
  blogPreview: { eyebrow: string; title: string; cta: CtaContent; featuredCount: number };
  faq: { eyebrow: string; title: string; emphasis: string; description: string; items: { id: string; question: string; answer: string; order: number }[] };
  finalCta: { eyebrow: string; title: string; emphasis: string; description: string; primaryCta: CtaContent; reassurance: string };
};
export type LandingContent = CmsDocumentBase & { key: "landing"; seo: SeoFields } & LandingSections;
export type PublicLanding = { page: "landing"; seo: SeoFields; sections: LandingSections; updatedAt: string };
