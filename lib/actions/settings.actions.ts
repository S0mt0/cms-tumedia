"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import { adminAllowlistRepository, normalizeEmail } from "@/lib/db/repositories/admin-allowlist.repository";
import { isEnvironmentAdmin } from "@/lib/auth/allowlist";
import { getDatabase } from "@/lib/db/config";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";
import { adminEmailSchema, googleSheetsSettingsSchema, mailServiceSettingsSchema } from "@/lib/schemas/settings.schema";
import type { ActionResult } from "@/lib/types/content";

export async function saveGoogleSheetsSettings(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = googleSheetsSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Enter a valid Google Sheets spreadsheet ID.", fieldErrors: parsed.error.flatten().fieldErrors };
  await settingsRepository.setGoogleSheetsSpreadsheetId(parsed.data.spreadsheetId, session.user.id);
  revalidatePath("/settings");
  return { success: true, message: "Google Sheets settings saved." };
}

export async function saveMailServiceSettings(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = mailServiceSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a sender name and a valid sender email address.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  await settingsRepository.setMailServiceSettings(parsed.data, session.user.id);
  revalidatePath("/settings");
  return { success: true, message: "Mail sender settings saved." };
}

export async function addAllowedAdmin(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = adminEmailSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Enter a valid admin email address." };
  const email = normalizeEmail(parsed.data.email);
  await adminAllowlistRepository.add(email, session.user.id);
  await adminLogRepository.record({ event: "admin_access_granted", adminId: session.user.id, email, createdAt: new Date() });
  revalidatePath("/settings");
  return { success: true, message: "Admin email added." };
}

export async function removeAllowedAdmin(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = adminEmailSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Enter a valid admin email address." };
  const email = normalizeEmail(parsed.data.email);
  if (isEnvironmentAdmin(email)) return { success: false, message: "Environment administrators cannot be removed here." };
  await adminAllowlistRepository.remove(email);
  await adminLogRepository.record({ event: "admin_access_revoked", adminId: session.user.id, email, createdAt: new Date() });
  revalidatePath("/settings");
  return { success: true, message: "Admin email removed." };
}

export async function deleteOwnAccount(): Promise<ActionResult> {
  const session = await requireAdminSession();
  const database = getDatabase();
  await adminLogRepository.recordAdminSessionsLogout(session.user.id);
  await Promise.all([
    database.collection("session").deleteMany({ userId: session.user.id }),
    database.collection("account").deleteMany({ userId: session.user.id }),
    database.collection("user").deleteOne({ id: session.user.id }),
  ]);
  await adminLogRepository.record({ event: "logout", adminId: session.user.id, email: session.user.email, createdAt: new Date() });
  return { success: true, message: "Your CMS account has been deleted." };
}
