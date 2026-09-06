import type { WithId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";
import { aboutDefaults } from "@/lib/db/repositories/about.defaults";
import { richTextFromParagraphs } from "@/lib/rich-text";
import type { AboutContent, AboutSections } from "@/lib/types/about";

type LegacyWhyWeExist = {
  eyebrow?: string;
  title?: string;
  paragraphs?: { text?: string; order?: number }[];
};

class AboutRepository extends BaseRepository<AboutContent> {
  protected readonly collectionName = "aboutContent";

  async get(): Promise<WithId<AboutContent>> {
    const document = await this.findOne({ key: "about" });
    if (!document) return this.insertOne(aboutDefaults());

    const legacy = document.whyWeExist as unknown as LegacyWhyWeExist;
    if (!("body" in legacy)) {
      const next = {
        eyebrow: legacy.eyebrow ?? "Why we exist",
        title: legacy.title ?? "Creator marketing needed a better middle ground.",
        body: richTextFromParagraphs(
          [...(legacy.paragraphs ?? [])]
            .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
            .map((paragraph) => paragraph.text ?? "")
            .filter(Boolean)
        ),
      };
      await this.updateOne(
        { key: "about" },
        { $set: { whyWeExist: next, updatedAt: new Date() } }
      );
      return { ...document, whyWeExist: next };
    }

    return document;
  }

  async updateSection<TKey extends keyof AboutSections>(
    section: TKey,
    data: AboutSections[TKey],
    updatedBy: string
  ) {
    return this.updateOne(
      { key: "about" },
      { $set: { [section]: data, updatedAt: new Date(), updatedBy } }
    );
  }
}

export const aboutRepository = new AboutRepository();
