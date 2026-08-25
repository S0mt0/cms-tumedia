import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import { assembleLanding } from "@/lib/api/assemblers/landing";
import { cacheKeys } from "@/lib/cache/keys";
import {
  readPublicCache,
  writePublicCache,
} from "@/lib/cache/public-content-cache";
import type { PublicLanding } from "@/lib/types/landing";

export async function GET() {
  try {
    const key = cacheKeys.page("landing");
    const cached = await readPublicCache<PublicLanding>(key);
    const data = cached ?? (await assembleLanding());
    if (!cached) await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch {
    return publicErrorResponse(
      "Landing content is unavailable.",
      503,
      "LANDING_UNAVAILABLE"
    );
  }
}
