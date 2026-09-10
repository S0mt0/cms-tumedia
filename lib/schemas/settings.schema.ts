import { z } from "zod";

export const googleSheetsSettingsSchema = z.object({ spreadsheetId: z.string().trim().min(20).max(200) });
export const adminEmailSchema = z.object({ email: z.string().trim().email().max(320) });
export const mailServiceSettingsSchema = z.object({
  senderName: z.string().trim().min(1).max(120),
  mailFrom: z.string().trim().email().max(320),
});
