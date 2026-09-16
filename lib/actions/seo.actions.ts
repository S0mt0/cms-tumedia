"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { getDatabase } from "@/lib/db/config";
import { seoPageSchema } from "@/lib/schemas/seo.schema";
import type { ActionResult, SeoFields } from "@/lib/types/content";
import { recordCmsActivity } from "@/lib/actions/activity-log";

const pages = {
  landing: { collection: "landingContent", key: "landing", cache: "landing", publicPath: "/" },
  about: { collection: "aboutContent", key: "about", cache: "about", publicPath: "/about" },
  contact: { collection: "contactContent", key: "contact", cache: "contact", publicPath: "/contact" },
  join: { collection: "joinContent", key: "join", cache: "join", publicPath: "/join" },
  blogs: { collection: "blogContent", key: "blogs", cache: "blogs", publicPath: "/blogs" },
  industries: { collection: "industriesContent", key: "industries", cache: "industries", publicPath: "/industries" },
  work: { collection: "workContent", key: "work", cache: "projects", publicPath: "/projects" },
  services: { collection: "servicesContent", key: "services", cache: "services", publicPath: "/services" },
  legal: { collection: "legalContent", key: "legal", cache: "legal", publicPath: "/privacy" },
} as const;

export async function updatePageSeo(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = seoPageSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the SEO fields.", fieldErrors: parsed.error.flatten().fieldErrors };

  const definition = pages[parsed.data.page];
  const result = await getDatabase().collection(definition.collection).updateOne(
    { key: definition.key },
    { $set: { seo: parsed.data.seo as SeoFields, updatedAt: new Date(), updatedBy: session.user.id } },
  );
  if (!result.matchedCount) return { success: false, message: "This page content has not been initialised yet." };

  await invalidateCache(cacheKeys.page(definition.cache));
  await recordCmsActivity(session.user, "updated_seo", parsed.data.page);
  revalidatePath(`/${parsed.data.page}/seo`);
  revalidatePath(definition.publicPath);
  if (parsed.data.page === "legal") revalidatePath("/terms");
  return { success: true, message: "SEO settings saved." };
}
