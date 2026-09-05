import { siteRepository } from "@/lib/db/repositories/site.repository";
import type { PublicSite } from "@/lib/types/site";

export async function assembleSite(): Promise<PublicSite> {
  const { seo, branding, footer, organisation, updatedAt } = await siteRepository.get();
  return { page: "site", seo, sections: { branding, footer, organisation }, updatedAt: updatedAt.toISOString() };
}
