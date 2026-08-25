import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { LandingContent, LandingSections } from "@/lib/types/landing";
import { landingDefaults } from "@/lib/db/repositories/landing.defaults";
class LandingRepository extends BaseRepository<LandingContent> {
  protected readonly collectionName = "landingContent";
  async get(): Promise<WithId<LandingContent>> { const found = await this.findOne({ key: "landing" }); return found ?? this.insertOne(landingDefaults()); }
  async updateSection<K extends keyof LandingSections>(section: K, data: LandingSections[K], updatedBy: string) { return this.updateOne({ key: "landing" }, { $set: { [section]: data, updatedAt: new Date(), updatedBy } }); }
}
export const landingRepository = new LandingRepository();
