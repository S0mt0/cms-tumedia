"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { siteRepository } from "@/lib/db/repositories/site.repository";
import { siteSchema } from "@/lib/schemas/site.schema";
import type { ActionResult } from "@/lib/types/content";

export async function updateSite(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = siteSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the site settings.", fieldErrors: parsed.error.flatten().fieldErrors };
  await siteRepository.update(parsed.data, session.user.id);
  await invalidateCache(cacheKeys.site());
  revalidatePath("/site");
  return { success: true, message: "Site settings saved." };
}
