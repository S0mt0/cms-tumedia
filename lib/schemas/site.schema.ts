import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const media = z.object({ url: z.string().url(), alt: text(200) });
export const siteSchema = z.object({
  seo: z.object({ title: text(160), description: text(320), ogImage: z.string().url().optional() }),
  branding: z.object({ logo: media.optional(), favicon: media.optional() }),
  organisation: z.object({ name: text(120), email: z.string().email(), phone: optionalText(80), address: optionalText(240) }),
});
