import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { SiteContent } from "@/lib/types/site";

function defaults(): SiteContent {
  const now = new Date();
  return {
    key: "site", createdAt: now, updatedAt: now,
    seo: { title: "TU Media", description: "Creator marketing for technology brands." },
    navigation: { servicesLabel: "Services", industriesLabel: "Industries", projectsLabel: "Work", blogsLabel: "Blogs", aboutLabel: "About", creatorsLabel: "For creators", contactLabel: "Connect with us" },
    footer: { positioning: "Technology × creator culture", contactEmail: "hello@tumedia.com", socialLinks: [] },
    organisation: { name: "TU Media", email: "hello@tumedia.com" },
  };
}

class SiteRepository extends BaseRepository<SiteContent> {
  protected readonly collectionName = "siteContent";
  async get(): Promise<WithId<SiteContent>> { return (await this.findOne({ key: "site" })) ?? this.insertOne(defaults()); }
  async update(data: Pick<SiteContent, "seo" | "navigation" | "footer" | "organisation">, updatedBy: string) {
    return this.updateOne({ key: "site" }, { $set: { ...data, updatedAt: new Date(), updatedBy } });
  }
}

export const siteRepository = new SiteRepository();
