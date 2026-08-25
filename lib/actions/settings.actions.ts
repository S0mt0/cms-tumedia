"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import { googleSheetsSettingsSchema } from "@/lib/schemas/settings.schema";
import type { ActionResult } from "@/lib/types/content";

export async function saveGoogleSheetsSettings(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = googleSheetsSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Enter a valid Google Sheets spreadsheet ID.", fieldErrors: parsed.error.flatten().fieldErrors };
  await settingsRepository.setGoogleSheetsSpreadsheetId(parsed.data.spreadsheetId, session.user.id);
  revalidatePath("/settings");
  return { success: true, message: "Google Sheets settings saved." };
}
