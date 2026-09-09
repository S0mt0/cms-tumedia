"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { servicesSectionSchemas, servicesUpdateSchema } from "@/lib/schemas/services.schema";
import type { ActionResult } from "@/lib/types/content";
import type { ServicesSections } from "@/lib/types/services";

export async function updateServicesSection(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = servicesUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the section fields." };
  const result = servicesSectionSchemas[parsed.data.section].safeParse(parsed.data.data);
  if (!result.success) return { success: false, message: "Please correct the section fields." };
  await servicesRepository.updateSection(parsed.data.section, result.data as ServicesSections[typeof parsed.data.section], session.user.id);
  await invalidateCache(cacheKeys.page("services"));
  revalidatePath(`/services/${parsed.data.section}`);
  revalidatePath("/services");
  return { success: true, message: "Section saved." };
}
