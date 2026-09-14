"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import {
  creatorSubmissionRepository,
  joinRepository,
} from "@/lib/db/repositories/join.repository";
import {
  joinSectionSchemas,
  joinUpdateSchema,
} from "@/lib/schemas/join.schema";
import { getGoogleSheetsErrorMessage, syncCreatorSheetRows } from "@/lib/services/google-sheets.service";
import type { ActionResult } from "@/lib/types/content";
import type { JoinSections } from "@/lib/types/join";

const paths = {
  hero: "hero",
  application: "application",
  nextSteps: "next-steps",
  faq: "faq",
} as const;

export async function updateJoinSection(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = joinUpdateSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Please correct the section fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  const data = joinSectionSchemas[parsed.data.section].safeParse(
    parsed.data.data
  );
  if (!data.success)
    return {
      success: false,
      message: "Please correct the section fields.",
      fieldErrors: data.error.flatten().fieldErrors,
    };
  await joinRepository.updateSection(
    parsed.data.section,
    data.data as JoinSections[typeof parsed.data.section],
    session.user.id
  );
  await invalidateCache(cacheKeys.page("join"));
  revalidatePath(`/join/${paths[parsed.data.section]}`);
  revalidatePath("/join");
  return { success: true, message: "Section saved." };
}

export async function deleteCreatorSubmissions(
  ids: string[]
): Promise<ActionResult> {
  await requireAdminSession();
  if (!ids.length)
    return { success: false, message: "Choose at least one submission." };
  await creatorSubmissionRepository.deleteMany(ids);
  revalidatePath("/join/submissions");
  return {
    success: true,
    message: `${ids.length} submission${ids.length === 1 ? "" : "s"} deleted.`,
  };
}
export async function markCreatorSubmissionRead(
  id: string
): Promise<ActionResult> {
  await requireAdminSession();
  await creatorSubmissionRepository.markRead(id);
  revalidatePath("/join/submissions");
  return { success: true, message: "Submission marked as read." };
}
export async function syncCreatorSubmissionsToGoogleSheet(): Promise<
  ActionResult<{ synced: number }>
> {
  await requireAdminSession();
  try {
    const synced = await syncCreatorSheetRows(
      await creatorSubmissionRepository.listAll()
    );
    revalidatePath("/join/submissions");
    return {
      success: true,
      message: `${synced} submission${
        synced === 1 ? "" : "s"
      } synced to Google Sheets.`,
      data: { synced },
    };
  } catch (error) {
    console.error("Unable to sync creator submissions", error);
    return {
      success: false,
      message: getGoogleSheetsErrorMessage(error) ?? "Could not sync submissions to Google Sheets.",
    };
  }
}
