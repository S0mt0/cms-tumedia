import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { HeroBackgroundMedia, LandingContent, LandingSections } from "@/lib/types/landing";
import { landingDefaults } from "@/lib/db/repositories/landing.defaults";
class LandingRepository extends BaseRepository<LandingContent> {
  protected readonly collectionName = "landingContent";
  async get(): Promise<WithId<LandingContent>> {
    const found = await this.findOne({ key: "landing" });
    if (!found) return this.insertOne(landingDefaults());

    const legacyHero = found.hero as LandingContent["hero"] & {
      primaryCta?: { label: string; href: string };
      secondaryCta?: { label: string; href: string };
      backgroundMedia: { url: string; alt?: string; type?: "image" | "video"; posterUrl?: string };
    };
    const ctas = legacyHero.ctas ?? [
      { id: "hero-contact", ...legacyHero.primaryCta!, variant: "primary" as const, order: 0 },
      { id: "hero-work", ...legacyHero.secondaryCta!, variant: "secondary" as const, order: 1 },
    ];
    const publicUrl = legacyHero.backgroundMedia.url.startsWith("/") || /^https?:\/\//i.test(legacyHero.backgroundMedia.url)
      ? legacyHero.backgroundMedia.url
      : `https://${legacyHero.backgroundMedia.url.replace(/^\/+/, "")}`;
    const backgroundMedia = legacyHero.backgroundMedia.type === "video"
      ? { type: "video" as const, url: publicUrl, alt: legacyHero.backgroundMedia.alt, posterUrl: legacyHero.backgroundMedia.posterUrl }
      : { type: "image" as const, url: publicUrl, alt: legacyHero.backgroundMedia.alt || "TU Media creators and technology" };

    if (!legacyHero.ctas || !legacyHero.backgroundMedia.type || legacyHero.backgroundMedia.url !== publicUrl) {
      const hero = Object.fromEntries(
        Object.entries(legacyHero).filter(
          ([key]) => key !== "primaryCta" && key !== "secondaryCta"
        )
      );
      const normalisedHero = {
        ...hero,
        ctas,
        backgroundMedia,
      } as LandingContent["hero"];
      const updated = await this.updateOne({ key: "landing" }, { $set: { hero: normalisedHero, updatedAt: new Date() }, $unset: { "hero.primaryCta": "", "hero.secondaryCta": "" } });
      return updated ?? found;
    }

    return found;
  }
  async updateHeroBackgroundMedia(data: HeroBackgroundMedia, updatedBy: string) {
    return this.updateOne({ key: "landing" }, { $set: { "hero.backgroundMedia": data, updatedAt: new Date(), updatedBy } });
  }
  async updateSection<K extends keyof LandingSections>(section: K, data: LandingSections[K], updatedBy: string) { return this.updateOne({ key: "landing" }, { $set: { [section]: data, updatedAt: new Date(), updatedBy } }); }
}
export const landingRepository = new LandingRepository();
