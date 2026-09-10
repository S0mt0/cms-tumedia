import { publicErrorResponse, publicPageResponse } from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import { readPublicCache, writePublicCache } from "@/lib/cache/public-content-cache";
import { legalRepository } from "@/lib/db/repositories/legal.repository";
import type { PublicLegal } from "@/lib/types/legal";
export async function GET() { try { const key = cacheKeys.page("legal"); const cached = await readPublicCache<PublicLegal>(key); if (cached) return publicPageResponse(cached); const { seo, terms, privacy, updatedAt } = await legalRepository.get(); const data: PublicLegal = { page: "legal", seo, sections: { terms, privacy }, updatedAt: updatedAt.toISOString() }; await writePublicCache(key, data); return publicPageResponse(data); } catch { return publicErrorResponse("Legal content is unavailable.", 503, "LEGAL_UNAVAILABLE"); } }
