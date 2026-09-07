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

type LegacyPerspective = Partial<AboutSections["perspective"]> & {
  brandsLabel?: string;
  creatorsLabel?: string;
};

type LegacyStory = {
  eyebrow?: string;
  title?: string;
  paragraphs?: { text?: string; order?: number }[];
  principlesEyebrow?: string;
  principles?: AboutSections["story"]["principles"];
};

class AboutRepository extends BaseRepository<AboutContent> {
  protected readonly collectionName = "aboutContent";

  async get(): Promise<WithId<AboutContent>> {
    const document = await this.findOne({ key: "about" });
    if (!document) {
      const inserted = await this.insertOne(aboutDefaults());
      const legacyStory = inserted.story as unknown as LegacyStory;
      const story = {
        eyebrow: legacyStory.eyebrow ?? "Our story",
        title: legacyStory.title ?? "Before the agency, there was the experience.",
        body: richTextFromParagraphs(
          [...(legacyStory.paragraphs ?? [])]
            .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
            .map((paragraph) => paragraph.text ?? "")
            .filter(Boolean)
        ),
        principlesEyebrow: legacyStory.principlesEyebrow ?? "How we work matters",
        principles: legacyStory.principles ?? [],
      };
      await this.updateOne(
        { key: "about" },
        { $set: { story, updatedAt: new Date() } }
      );
      return { ...inserted, story };
    }

    const updates: Partial<AboutSections> = {};
    const legacyWhyWeExist = document.whyWeExist as unknown as LegacyWhyWeExist;

    if (!("body" in legacyWhyWeExist)) {
      updates.whyWeExist = {
        eyebrow: legacyWhyWeExist.eyebrow ?? "Why we exist",
        title:
          legacyWhyWeExist.title ??
          "Creator marketing needed a better middle ground.",
        body: richTextFromParagraphs(
          [...(legacyWhyWeExist.paragraphs ?? [])]
            .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
            .map((paragraph) => paragraph.text ?? "")
            .filter(Boolean)
        ),
      };
    }

    const legacyPerspective = document.perspective as unknown as LegacyPerspective;
    if (!("brandsEyebrow" in legacyPerspective)) {
      updates.perspective = {
        eyebrow: legacyPerspective.eyebrow ?? "Our perspective",
        title: legacyPerspective.title ?? "We have seen both sides.",
        description:
          legacyPerspective.description ??
          "The work is strongest when brands, creators, and audiences all have room to win.",
        bridgeEyebrow: legacyPerspective.bridgeEyebrow ?? "Together with",
        bridgeTitle: legacyPerspective.bridgeTitle ?? "TU Media",
        brandsEyebrow: legacyPerspective.brandsLabel ?? "Brands",
        brandsTitle: legacyPerspective.brandsTitle ?? "What a strong partnership needs",
        creatorsEyebrow: legacyPerspective.creatorsLabel ?? "Creators",
        creatorsTitle:
          legacyPerspective.creatorsTitle ?? "What a strong partnership needs",
        brands: legacyPerspective.brands ?? [],
        creators: legacyPerspective.creators ?? [],
      };
    }

    const legacyStory = document.story as unknown as LegacyStory & { body?: unknown };
    if (!("body" in legacyStory)) {
      updates.story = {
        eyebrow: legacyStory.eyebrow ?? "Our story",
        title: legacyStory.title ?? "Before the agency, there was the experience.",
        body: richTextFromParagraphs(
          [...(legacyStory.paragraphs ?? [])]
            .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
            .map((paragraph) => paragraph.text ?? "")
            .filter(Boolean)
        ),
        principlesEyebrow: legacyStory.principlesEyebrow ?? "How we work matters",
        principles: legacyStory.principles ?? [],
      };
    }

    if (Object.keys(updates).length > 0) {
      await this.updateOne(
        { key: "about" },
        { $set: { ...updates, updatedAt: new Date() } }
      );
      return { ...document, ...updates };
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
