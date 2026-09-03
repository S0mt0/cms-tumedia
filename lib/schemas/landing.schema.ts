import { z } from "zod";

import { marqueeIconIds } from "@/lib/constants/marquee-icons";

const text = (max: number) => z.string().trim().min(1).max(max);

const cta = z.object({
  label: text(80),
  href: z.string().trim().startsWith("/").max(240),
});

export const mediaReferenceSchema = z.object({
  url: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(200),
});

const youtubeUrl = z.url().max(500).refine(
  (value) => {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return ["youtube.com", "youtube-nocookie.com", "youtu.be"].includes(hostname);
  },
  "Use a YouTube, YouTube-nocookie, or youtu.be URL."
);

const item = z.object({
  id: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

const heroCta = cta.extend({
  id: z.string().min(1).max(100),
  order: z.number().int().min(0).max(1),
  variant: z.enum(["primary", "secondary"]),
});

export const heroBackgroundMediaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    url: z.string().trim().min(1).max(500),
    alt: text(200),
  }),

  z.object({
    type: z.literal("video"),
    url: z.string().trim().min(1).max(500),
    alt: z.string().trim().max(200).optional(),
    posterUrl: z.string().trim().min(1).max(500).optional(),
  }),
]);

export const landingSectionSchemas = {
  hero: z.object({
    eyebrow: text(100),
    title: text(150),
    emphasis: text(150),
    description: text(500),
    ctas: z
      .array(heroCta)
      .length(2)
      .superRefine((ctas, context) => {
        if (new Set(ctas.map((ctaItem) => ctaItem.id)).size !== 2)
          context.addIssue({
            code: "custom",
            message: "Each call to action must have a unique identifier.",
          });

        if (new Set(ctas.map((ctaItem) => ctaItem.variant)).size !== 2)
          context.addIssue({
            code: "custom",
            message: "Choose one primary and one secondary action.",
          });

        if (new Set(ctas.map((ctaItem) => ctaItem.order)).size !== 2)
          context.addIssue({
            code: "custom",
            message: "Each call to action must have a unique position.",
          });
      }),
    backgroundMedia: heroBackgroundMediaSchema,
    scrollLabel: text(80),
  }),

  positioning: z.object({
    title: text(160),
    description: text(700),
    cta,
    stats: z
      .array(item.extend({ value: text(50), label: text(120) }))
      .min(1)
      .max(6),
    marqueeItems: z
      .array(item.extend({ label: text(80), iconKey: z.enum(marqueeIconIds) }))
      .min(1)
      .max(12),
  }),

  process: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(700),
    cta,
    media: mediaReferenceSchema,
    imageWordmark: text(100),
    steps: z
      .array(item.extend({ title: text(120) }))
      .min(1)
      .max(8),
  }),

  creatorFlowCta: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(700),
    cta,
    media: mediaReferenceSchema,
    mediaCaption: text(180),
  }),

  industriesPreview: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(500),
    items: z
      .array(
        item.extend({
          label: text(100),
          href: z.string().startsWith("/").max(240),
          image: mediaReferenceSchema,
        })
      )
      .min(1)
      .max(8),
  }),

  videoShowcase: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(500),
    cta,
    youtubeUrl,
    videoTitle: text(160),
  }),

  whyTuMedia: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(700),
    media: mediaReferenceSchema,
    items: z
      .array(item.extend({ text: text(240) }))
      .min(1)
      .max(8),
  }),

  blogPreview: z.object({
    eyebrow: text(100),
    title: text(160),
    cta,
    featuredCount: z.number().int().min(1).max(6),
  }),

  faq: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(500),
    items: z
      .array(item.extend({ question: text(240), answer: text(700) }))
      .min(1)
      .max(12),
  }),

  finalCta: z.object({
    eyebrow: text(100),
    title: text(160),
    description: text(400),
    primaryCta: cta,
    reassurance: text(180),
  }),
};

export const landingUpdateSchema = z.object({
  section: z.enum([
    "hero",
    "positioning",
    "process",
    "creatorFlowCta",
    "industriesPreview",
    "videoShowcase",
    "whyTuMedia",
    "blogPreview",
    "faq",
    "finalCta",
  ]),
  data: z.unknown(),
});
