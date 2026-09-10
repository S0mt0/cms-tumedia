import { z } from "zod";

export const googleSheetsSettingsSchema = z.object({ spreadsheetId: z.string().trim().min(20).max(200) });
export const adminEmailSchema = z.object({ email: z.string().trim().email().max(320) });
