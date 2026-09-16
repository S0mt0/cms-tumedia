"use server";
import { recordCmsActivity } from "@/lib/actions/activity-log";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { legalRepository } from "@/lib/db/repositories/legal.repository";
import { legalUpdateSchema } from "@/lib/schemas/legal.schema";
import type { ActionResult } from "@/lib/types/content";
export async function updateLegalDocument(input: unknown): Promise<ActionResult> { const session = await requireAdminSession(); const parsed = legalUpdateSchema.safeParse(input); if (!parsed.success) return { success: false, message: "Please correct the legal document fields." }; await legalRepository.updateDocument(parsed.data.section, parsed.data.data, session.user.id); await invalidateCache(cacheKeys.page("legal")); await recordCmsActivity(session.user, "updated_content", `Legal / ${parsed.data.section}`); revalidatePath("/legal"); revalidatePath(`/${parsed.data.section}`); return { success: true, message: "Legal document saved." }; }
