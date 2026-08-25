import { assembleSite } from "@/lib/api/assemblers/site";
import { publicErrorResponse, publicPageResponse } from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import { readPublicCache, writePublicCache } from "@/lib/cache/public-content-cache";
import type { PublicSite } from "@/lib/types/site";

export async function GET() {
  try {
    const key = cacheKeys.site();
    const cached = await readPublicCache<PublicSite>(key);
    const data = cached ?? await assembleSite();
    if (!cached) await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch { return publicErrorResponse("Site content is unavailable.", 503, "SITE_UNAVAILABLE"); }
}
