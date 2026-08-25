import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
const cta = z.object({ label: text(80), href: z.string().trim().startsWith("/").max(240) });
const media = z.object({ url: z.string().trim().min(1).max(500), alt: z.string().trim().min(1).max(200) });
const item = z.object({ id: z.string().min(1).max(100), order: z.number().int().min(0) });
export const landingSectionSchemas = {
  hero: z.object({ eyebrow: text(100), title: text(150), emphasis: text(150), description: text(500), primaryCta: cta, secondaryCta: cta, backgroundMedia: media, scrollLabel: text(80) }),
  positioning: z.object({ title: text(160), description: text(700), cta, stats: z.array(item.extend({ value: text(50), label: text(120) })).min(1).max(6), marqueeItems: z.array(item.extend({ label: text(80) })).min(1).max(12) }),
  process: z.object({ eyebrow: text(100), title: text(160), description: text(700), cta, media, imageWordmark: text(100), steps: z.array(item.extend({ title: text(120) })).min(1).max(8) }),
  creatorFlowCta: z.object({ eyebrow: text(100), title: text(160), emphasis: text(160), description: text(700), cta, media, mediaCaption: text(180) }),
  industriesPreview: z.object({ eyebrow: text(100), title: text(160), description: text(500), items: z.array(item.extend({ label: text(100), href: z.string().startsWith("/").max(240), image: media })).min(1).max(8) }),
  videoShowcase: z.object({ eyebrow: text(100), title: text(160), emphasis: text(160), description: text(500), cta, youtubeUrl: z.string().url().max(500), videoTitle: text(160) }),
  whyTuMedia: z.object({ eyebrow: text(100), title: text(160), emphasis: text(160), description: text(700), media, items: z.array(item.extend({ text: text(240) })).min(1).max(8) }),
  blogPreview: z.object({ eyebrow: text(100), title: text(160), cta, featuredCount: z.number().int().min(1).max(6) }),
  faq: z.object({ eyebrow: text(100), title: text(160), emphasis: text(160), description: text(500), items: z.array(item.extend({ question: text(240), answer: text(700) })).min(1).max(12) }),
  finalCta: z.object({ eyebrow: text(100), title: text(160), emphasis: text(160), description: text(400), primaryCta: cta, reassurance: text(180) }),
};
export const landingUpdateSchema = z.object({ section: z.enum(["hero", "positioning", "process", "creatorFlowCta", "industriesPreview", "videoShowcase", "whyTuMedia", "blogPreview", "faq", "finalCta"]), data: z.unknown() });
