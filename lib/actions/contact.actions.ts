"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { contactRepository, contactSubmissionRepository } from "@/lib/db/repositories/contact.repository";
import { getGoogleSheetsErrorMessage, syncContactSheetRows } from "@/lib/services/google-sheets.service";
import { contactSectionSchemas, contactUpdateSchema } from "@/lib/schemas/contact.schema";
import type { ContactSections } from "@/lib/types/contact";
import type { ActionResult } from "@/lib/types/content";

const paths = { hero: "hero", conversation: "conversation", nextSteps: "next-steps", info: "info" } as const;

export async function updateContactSection(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = contactUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the section fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const data = contactSectionSchemas[parsed.data.section].safeParse(parsed.data.data);
  if (!data.success) return { success: false, message: "Please correct the section fields.", fieldErrors: data.error.flatten().fieldErrors };
  await contactRepository.updateSection(parsed.data.section, data.data as ContactSections[typeof parsed.data.section], session.user.id);
  await invalidateCache(cacheKeys.page("contact"));
  revalidatePath(`/contact/${paths[parsed.data.section]}`);
  revalidatePath("/contact");
  return { success: true, message: "Section saved." };
}

export async function deleteContactSubmissions(ids: string[]): Promise<ActionResult> {
  await requireAdminSession();
  if (!ids.length) return { success: false, message: "Choose at least one submission." };
  await contactSubmissionRepository.deleteMany(ids);
  revalidatePath("/contact/submissions");
  return { success: true, message: `${ids.length} submission${ids.length === 1 ? "" : "s"} deleted.` };
}

export async function markContactSubmissionRead(id: string): Promise<ActionResult> {
  await requireAdminSession();
  await contactSubmissionRepository.markRead(id);
  revalidatePath("/contact/submissions");
  return { success: true, message: "Submission marked as read." };
}

export async function syncContactSubmissionsToGoogleSheet(): Promise<ActionResult<{ synced: number }>> {
  await requireAdminSession();

  try {
    const synced = await syncContactSheetRows(await contactSubmissionRepository.listAll());
    revalidatePath("/contact/submissions");
    return { success: true, message: `${synced} submission${synced === 1 ? "" : "s"} synced to Google Sheets.`, data: { synced } };
  } catch (error) {
    console.error("Unable to sync contact submissions to Google Sheets", error);
    return { success: false, message: getGoogleSheetsErrorMessage(error) ?? "Could not sync submissions to Google Sheets." };
  }
}
