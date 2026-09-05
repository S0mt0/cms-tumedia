import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const media = z.object({ url: z.string().url(), alt: text(200) });
export const siteSchema = z.object({
  seo: z.object({ title: text(160), description: text(320), ogImage: z.string().url().optional() }),
  branding: z.object({ logo: media.optional(), favicon: media.optional() }),
  footer: z.object({ positioning: text(180), socialLinks: z.array(z.object({ id: text(40), url: text(240), order: z.number().int().min(0) })).max(8), newsletter: z.object({ enabled: z.boolean(), title: text(120), description: text(300) }).optional() }),
  organisation: z.object({ name: text(120), email: z.string().email(), phone: optionalText(80), address: optionalText(240) }),
});
