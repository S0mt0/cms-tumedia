import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const orderedText = (max: number) =>
  z.object({ id: text(100), text: text(max), order: z.number().int().min(0) });

export const contactSectionSchemas = {
  hero: z.object({
    eyebrow: optionalText(100),
    title: text(200),
    emphasis: optionalText(100),
    description: optionalText(700),
    notes: z.array(orderedText(100)).max(6),
  }),
  conversation: z.object({
    eyebrow: optionalText(100),
    title: text(200),
    emphasis: optionalText(100),
    description: optionalText(700),
    creatorPrompt: optionalText(200),
    creatorLinkLabel: optionalText(100),
  }),
  nextSteps: z.object({
    eyebrow: optionalText(100),
    title: text(200),
    emphasis: optionalText(100),
    description: optionalText(700),
    steps: z
      .array(
        z.object({
          id: text(100),
          title: text(180),
          copy: text(700),
          order: z.number().int().min(0),
        })
      )
      .min(1)
      .max(8),
  }),
  info: z.object({
    phone: optionalText(80),
    email: z.string().trim().email().optional().or(z.literal("")),
    address: optionalText(240),
    socialLinks: z
      .array(
        z.object({
          id: text(40).regex(/^[a-z0-9-]+$/, "Use a lowercase social ID."),
          url: text(500),
          order: z.number().int().min(0),
        })
      )
      .max(12),
  }),
};

export const contactUpdateSchema = z.object({
  section: z.enum(["hero", "conversation", "nextSteps", "info"]),
  data: z.unknown(),
});

export const contactSubmissionSchema = z.object({
  fullName: text(120),
  email: z.string().trim().email().max(320),
  company: text(160),
  website: z.string().trim().url().max(500).optional().or(z.literal("")),
  market: text(160),
  product: text(160),
  objective: text(160),
  timeline: text(100),
  budget: optionalText(100),
  message: text(4_000),
});
