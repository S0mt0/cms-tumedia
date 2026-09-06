import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const cta = z.object({
  label: text(80),
  href: z.union([
    z.string().trim().startsWith("/").max(240),
    z.string().trim().startsWith("#").max(240),
  ]),
});
const media = z.object({ url: text(500), alt: text(200) });
const item = z.object({
  id: text(100),
  text: text(700),
  order: z.number().int().min(0),
});
const allowedSectionTag = (tag: string) =>
  /^<\/?(strong|em|u|sup|sub)>$/.test(tag) ||
  /^<p(?: style="text-align: (left|center|right|justify)")?>$/.test(tag) ||
  tag === "</p>" ||
  /^<mark(?: data-color="#[\da-fA-F]{6}" style="background-color: (?:#[\da-fA-F]{6}|rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)); color: inherit;?")?>$/.test(
    tag
  ) ||
  tag === "</mark>";
const sectionTextHtml = z
  .string()
  .trim()
  .min(1)
  .max(20_000)
  .refine(
    (html) =>
      (html.match(/<\/?[^>]+>/g) ?? []).every(allowedSectionTag),
    "Section copy contains unsupported formatting."
  );
const richTextDocument = z.object({
  json: z.record(z.string(), z.unknown()),
  html: sectionTextHtml,
});

export const aboutSectionSchemas = {
  hero: z.object({
    eyebrow: optionalText(100),
    title: text(200),
    emphasis: optionalText(100),
    description: optionalText(700),
    supportingCopy: optionalText(700),
    cta: cta.optional(),
    background: media.optional(),
    collage: z
      .array(media.extend({ id: text(100), order: z.number().int().min(0) }))
      .max(3),
  }),
  whyWeExist: z.object({
    eyebrow: text(100),
    title: text(200),
    body: richTextDocument,
  }),
  perspective: z.object({
    eyebrow: text(100),
    title: text(200),
    description: text(700),
    bridgeEyebrow: text(100),
    bridgeTitle: text(100),
    brandsLabel: text(100),
    creatorsLabel: text(100),
    brands: z.array(item).min(1).max(12),
    creators: z.array(item).min(1).max(12),
  }),
  difference: z.object({
    eyebrow: text(100),
    title: text(200),
    introduction: text(700),
    cta,
    items: z
      .array(
        z.object({
          id: text(100),
          title: text(160),
          short: text(300),
          copy: text(700),
          details: z.array(item).min(1).max(8),
          order: z.number().int().min(0),
        })
      )
      .min(1)
      .max(8),
  }),
  story: z.object({
    eyebrow: text(100),
    title: text(200),
    paragraphs: z.array(item).min(1).max(8),
    principlesEyebrow: text(100),
    principles: z
      .array(
        z.object({
          id: text(100),
          title: text(160),
          copy: text(400),
          order: z.number().int().min(0),
        })
      )
      .min(1)
      .max(8),
  }),
  globalCapability: z.object({
    eyebrow: text(100),
    title: text(200),
    description: text(700),
    scrollHint: text(200),
    locations: z
      .array(
        z.object({
          id: text(100),
          title: text(160),
          label: text(180),
          copy: text(700),
          image: media,
          order: z.number().int().min(0),
        })
      )
      .min(1)
      .max(8),
  }),
  audiencePaths: z.object({
    eyebrow: text(100),
    title: text(200),
    brand: z.object({
      eyebrow: text(100),
      copy: text(500),
      title: text(200),
      cta,
      supportingCopy: text(300),
    }),
    creator: z.object({
      eyebrow: text(100),
      copy: text(500),
      title: text(200),
      cta,
      supportingCopy: text(300),
      background: media,
    }),
  }),
  closing: z.object({
    workEyebrow: text(100),
    workTitle: text(200),
    workDescription: text(500),
    industries: z.array(item).min(1).max(16),
    manifestoEyebrow: text(100),
    manifestoTitle: text(200),
    manifestoDescription: text(500),
    manifestoCta: cta,
    finalTitle: text(200),
    finalDescription: text(500),
    primaryCta: cta,
    secondaryCta: cta,
  }),
};

export const aboutUpdateSchema = z.object({
  section: z.enum([
    "hero",
    "whyWeExist",
    "perspective",
    "difference",
    "story",
    "globalCapability",
    "audiencePaths",
    "closing",
  ]),
  data: z.unknown(),
});
