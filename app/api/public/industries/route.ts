import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import {
  readPublicCache,
  writePublicCache,
} from "@/lib/cache/public-content-cache";
import { industriesRepository } from "@/lib/db/repositories/industries.repository";
import type { PublicIndustries } from "@/lib/types/industries";
export async function GET() {
  try {
    const key = cacheKeys.page("industries");
    const cached = await readPublicCache<PublicIndustries>(key);
    if (cached) return publicPageResponse(cached);
    const { seo, hero, introduction, items, updatedAt } =
      await industriesRepository.get();
    const data: PublicIndustries = {
      page: "industries",
      seo,
      sections: { hero, introduction, items },
      updatedAt: updatedAt.toISOString(),
    };
    await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch {
    return publicErrorResponse(
      "Industries content is unavailable.",
      503,
      "INDUSTRIES_UNAVAILABLE"
    );
  }
}
