"use server";
import { revalidatePath } from "next/cache";
import { isAdminEmail } from "@/lib/auth/allowlist";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { landingRepository } from "@/lib/db/repositories/landing.repository";
import { heroBackgroundMediaSchema, landingSectionSchemas, landingUpdateSchema } from "@/lib/schemas/landing.schema";
import type { ActionResult } from "@/lib/types/content";
export async function updateLandingSection(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  if (!(await isAdminEmail(session.user.email))) return { success: false, message: "Not authorised." };
  const parsed = landingUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the section fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const sectionData = landingSectionSchemas[parsed.data.section].safeParse(parsed.data.data);
  if (!sectionData.success) return { success: false, message: "Please correct the section fields.", fieldErrors: sectionData.error.flatten().fieldErrors };
  await landingRepository.updateSection(parsed.data.section, sectionData.data as never, session.user.id);
  await invalidateCache(cacheKeys.page("landing"));
  revalidatePath(`/landing/${parsed.data.section}`);
  return { success: true, message: "Section saved." };
}

export async function updateLandingHeroBackgroundMedia(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  if (!(await isAdminEmail(session.user.email))) return { success: false, message: "Not authorised." };
  const parsed = heroBackgroundMediaSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please choose valid background media." };
  await landingRepository.updateHeroBackgroundMedia(parsed.data, session.user.id);
  await invalidateCache(cacheKeys.page("landing"));
  revalidatePath("/landing/hero");
  return { success: true, message: "Hero background saved." };
}
