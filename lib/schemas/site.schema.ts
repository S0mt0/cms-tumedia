import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
export const siteSchema = z.object({
  seo: z.object({ title: text(160), description: text(320), ogImage: z.string().url().optional() }),
  navigation: z.object({ servicesLabel: text(50), industriesLabel: text(50), projectsLabel: text(50), blogsLabel: text(50), aboutLabel: text(50), creatorsLabel: text(50), contactLabel: text(50) }),
  footer: z.object({ positioning: text(180), contactEmail: z.string().email(), socialLinks: z.array(z.object({ id: text(80), label: text(60), url: z.string().url(), order: z.number().int().min(0) })).max(8), newsletter: z.object({ enabled: z.boolean(), title: text(120), description: text(300) }).optional() }),
  organisation: z.object({ name: text(120), email: z.string().email() }),
});
