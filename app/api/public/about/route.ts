import { assembleAbout } from "@/lib/api/assemblers/about";
import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import {
  readPublicCache,
  writePublicCache,
} from "@/lib/cache/public-content-cache";
import type { PublicAbout } from "@/lib/types/about";

export async function GET() {
  try {
    const key = cacheKeys.page("about");
    const cached = await readPublicCache<PublicAbout>(key);
    const data = cached ?? (await assembleAbout());
    if (!cached) await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch {
    return publicErrorResponse(
      "About content is unavailable.",
      503,
      "ABOUT_UNAVAILABLE"
    );
  }
}
