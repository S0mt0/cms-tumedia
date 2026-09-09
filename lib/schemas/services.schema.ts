import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max).optional();
const ordered = z.object({ id: text(100), order: z.number().int().min(0) });
const item = ordered.extend({ title: text(180), tagline: optional(300), copy: text(1200), details: z.array(text(240)).max(12).default([]) });
export const servicesSectionSchemas = {
  hero: z.object({ eyebrow: optional(100), title: text(240), emphasis: optional(120), description: optional(700), exploreLabel: optional(80), contactLabel: optional(80) }),
  overview: z.object({ title: text(240), description: text(700), items: z.array(item.pick({ id: true, order: true, title: true, tagline: true, copy: true })).min(1).max(8) }),
  system: z.object({ eyebrow: optional(100), title: text(240), description: text(700), needs: z.array(ordered.extend({ title: text(180), copy: text(700) })).min(1).max(8) }),
  deepDives: z.object({ items: z.array(item).min(1).max(8) }),
  process: z.object({ title: text(240), description: text(700), steps: z.array(ordered.extend({ title: text(160), copy: text(700) })).min(1).max(12) }),
  industries: z.object({ title: text(240), description: text(700) }),
  faq: z.object({ eyebrow: optional(100), title: text(240), items: z.array(ordered.extend({ question: text(240), answer: text(1200) })).max(12) }),
  closing: z.object({ title: text(240), description: text(700), primaryLabel: optional(80), secondaryLabel: optional(80) }),
};
export const servicesUpdateSchema = z.object({ section: z.enum(["hero", "overview", "system", "deepDives", "process", "industries", "faq", "closing"]), data: z.unknown() });
