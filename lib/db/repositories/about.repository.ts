import type { WithId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";
import { aboutDefaults } from "@/lib/db/repositories/about.defaults";
import type { AboutContent, AboutSections } from "@/lib/types/about";

class AboutRepository extends BaseRepository<AboutContent> {
  protected readonly collectionName = "aboutContent";

  async get(): Promise<WithId<AboutContent>> {
    return (await this.findOne({ key: "about" })) ?? this.insertOne(aboutDefaults());
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
