import { z } from "zod";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .optional()
    .transform((value) => value || undefined);

export const seoFieldsSchema = z.object({
  title: optionalText(160),
  description: optionalText(320),
  ogImage: z
    .url()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

export const seoPageSchema = z.object({
  page: z.enum([
    "landing",
    "about",
    "contact",
    "join",
    "blogs",
    "industries",
    "work",
    "services",
    "legal",
  ]),
  seo: seoFieldsSchema,
});
