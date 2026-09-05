import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { PublicAbout } from "@/lib/types/about";

export async function assembleAbout(): Promise<PublicAbout> {
  const { seo, updatedAt, ...sections } = await aboutRepository.get();
  return { page: "about", seo, sections, updatedAt: updatedAt.toISOString() };
}
