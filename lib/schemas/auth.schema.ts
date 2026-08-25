import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z.string().trim().email("Enter a valid work email address."),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
