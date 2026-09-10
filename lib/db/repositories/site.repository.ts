import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { SiteContent } from "@/lib/types/site";

function defaults(): SiteContent {
  const now = new Date();
  return {
    key: "site", createdAt: now, updatedAt: now,
    seo: { title: "TU Media", description: "Creator marketing for technology brands." },
    branding: {},
    organisation: { name: "TU Media", email: "hello@tumedia.com", phone: "", address: "" },
  };
}

class SiteRepository extends BaseRepository<SiteContent> {
  protected readonly collectionName = "siteContent";
  async get(): Promise<WithId<SiteContent>> {
    const existing = await this.findOne({ key: "site" });
    if (!existing) return this.insertOne(defaults());
    const fallback = defaults();
    return { ...fallback, ...existing, branding: { ...fallback.branding, ...existing.branding }, organisation: { ...fallback.organisation, ...existing.organisation } };
  }
  async update(data: Pick<SiteContent, "seo" | "branding" | "organisation">, updatedBy: string) {
    return this.updateOne({ key: "site" }, { $set: { ...data, updatedAt: new Date(), updatedBy } });
  }
}

export const siteRepository = new SiteRepository();
