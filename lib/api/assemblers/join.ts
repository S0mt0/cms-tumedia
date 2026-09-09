import { joinRepository } from "@/lib/db/repositories/join.repository";
import type { PublicJoin } from "@/lib/types/join";

export async function assembleJoin(): Promise<PublicJoin> {
  const { seo, updatedAt, hero, application, nextSteps, faq } = await joinRepository.get();
  return { page: "join", seo, sections: { hero, application, nextSteps, faq }, updatedAt: updatedAt.toISOString() };
}
