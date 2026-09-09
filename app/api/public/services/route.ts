import { publicErrorResponse, publicPageResponse } from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import { readPublicCache, writePublicCache } from "@/lib/cache/public-content-cache";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
import type { PublicServices } from "@/lib/types/services";

export async function GET() {
  try {
    const key = cacheKeys.page("services");
    const cached = await readPublicCache<PublicServices>(key);
    if (cached) return publicPageResponse(cached);
    const { seo, hero, overview, system, deepDives, process, industries, faq, closing, updatedAt } = await servicesRepository.get();
    const data: PublicServices = { page: "services", seo, sections: { hero, overview, system, deepDives, process, industries, faq, closing }, updatedAt: updatedAt.toISOString() };
    await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch { return publicErrorResponse("Services content is unavailable.", 503, "SERVICES_UNAVAILABLE"); }
}
