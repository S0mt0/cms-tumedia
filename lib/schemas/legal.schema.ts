import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
export const legalDocumentSchema = z.object({ title: text(160), updatedLabel: text(100), content: text(100_000) });
export const legalUpdateSchema = z.object({ section: z.enum(["terms", "privacy"]), data: legalDocumentSchema });
