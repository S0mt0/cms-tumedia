"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import { normaliseRichTextJson } from "@/lib/rich-text";
import {
  aboutSectionSchemas,
  aboutUpdateSchema,
} from "@/lib/schemas/about.schema";
import type { AboutSections } from "@/lib/types/about";
import { recordCmsActivity } from "@/lib/actions/activity-log";

const paths = {
  hero: "hero",
  whyWeExist: "why-we-exist",
  perspective: "our-perspective",
  difference: "our-difference",
  story: "our-story",
  globalCapability: "global-capability",
  audiencePaths: "audience-paths",
  closing: "closing",
} as const;

export async function updateAboutSection(
  input: unknown
): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = aboutUpdateSchema.safeParse(input);

  if (!parsed.success)
    return {
      success: false,
      message: "Please correct the section fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  const data = aboutSectionSchemas[parsed.data.section].safeParse(
    parsed.data.data
  );

  if (!data.success)
    return {
      success: false,
      message: "Please correct the section fields.",
      fieldErrors: data.error.flatten().fieldErrors,
    };

  const sectionData =
    parsed.data.section === "whyWeExist" || parsed.data.section === "story"
      ? (() => {
          const section = data.data as AboutSections["whyWeExist"] | AboutSections["story"];
          return {
            ...section,
            body: {
              ...section.body,
              json: normaliseRichTextJson(section.body.json),
            },
          };
        })()
      : data.data;

  await aboutRepository.updateSection(
    parsed.data.section,
    sectionData as never,
    session.user.id
  );

  await invalidateCache(cacheKeys.page("about"));
  void recordCmsActivity(session.user, "updated_content", `About / ${paths[parsed.data.section]}`);
  revalidatePath(`/about/${paths[parsed.data.section]}`);
  revalidatePath("/about");
  return { success: true, message: "Section saved." };
}
