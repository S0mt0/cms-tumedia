import { contactRepository } from "@/lib/db/repositories/contact.repository";
import type { PublicContact } from "@/lib/types/contact";

export async function assembleContact(): Promise<PublicContact> {
  const { seo, updatedAt, hero, conversation, nextSteps, info } = await contactRepository.get();
  return {
    page: "contact",
    seo,
    sections: { hero, conversation, nextSteps, info },
    updatedAt: updatedAt.toISOString(),
  };
}
