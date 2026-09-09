import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const media = z.discriminatedUnion("type", [z.object({ type: z.literal("image"), url: text(1_000), alt: text(300) }), z.object({ type: z.literal("video"), url: text(1_000), alt: optionalText(300), posterUrl: optionalText(1_000) })]);
const step = z.object({ id: text(100), title: text(180), copy: text(700), order: z.number().int().min(0) });
const faq = z.object({ id: text(100), question: text(300), answer: text(2_000), order: z.number().int().min(0) });

export const joinSectionSchemas = {
  hero: z.object({ eyebrow: optionalText(100), title: text(200), emphasis: optionalText(100), description: optionalText(700), ctaLabel: optionalText(100), media }),
  application: z.object({ eyebrow: optionalText(100), title: text(200), emphasis: optionalText(100), description: optionalText(1_000), privacyLabel: optionalText(160) }),
  nextSteps: z.object({ eyebrow: optionalText(100), title: text(200), emphasis: optionalText(100), description: optionalText(700), steps: z.array(step).min(1).max(8) }),
  faq: z.object({ eyebrow: optionalText(100), title: text(200), description: optionalText(700), items: z.array(faq).min(1).max(12) }),
};
export const joinUpdateSchema = z.object({ section: z.enum(["hero", "application", "nextSteps", "faq"]), data: z.unknown() });
export const creatorSubmissionSchema = z.object({
  fullName: text(120), email: z.string().trim().email().max(320), country: text(120), niche: text(160), platform: text(120), languages: optionalText(200), followers: text(80), averageViews: text(80), topRegion: text(120), categories: optionalText(300), about: optionalText(4_000), primarySocialLink: z.string().trim().url().max(500), secondarySocialLink: z.string().trim().url().max(500).optional().or(z.literal("")), mediaKitUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});
