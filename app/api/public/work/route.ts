import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import {
  readPublicCache,
  writePublicCache,
} from "@/lib/cache/public-content-cache";
import { workRepository } from "@/lib/db/repositories/work.repository";
import type { PublicWork } from "@/lib/types/work";
export async function GET() {
  try {
    const key = cacheKeys.page("projects");
    const cached = await readPublicCache<PublicWork>(key);
    if (cached) return publicPageResponse(cached);
    const { seo, hero, collection, process, faq, invitation, updatedAt } =
      await workRepository.get();
    const data: PublicWork = {
      page: "work",
      seo,
      sections: { hero, collection, process, faq, invitation },
      updatedAt: updatedAt.toISOString(),
    };
    await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch {
    return publicErrorResponse(
      "Work content is unavailable.",
      503,
      "WORK_UNAVAILABLE"
    );
  }
}
