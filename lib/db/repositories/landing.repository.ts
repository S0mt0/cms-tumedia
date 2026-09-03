import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import { marqueeIconIds } from "@/lib/constants/marquee-icons";
import type { LandingContent, LandingSections } from "@/lib/types/landing";
import { landingDefaults } from "@/lib/db/repositories/landing.defaults";

function normaliseMediaUrl(url: string) {
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  return `https://${url.replace(/^\/+/, "")}`;
}

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

    const marqueeItems = found.positioning.marqueeItems.map((item, index) => ({
      ...item,
      iconKey: item.iconKey ?? marqueeIconIds[index % marqueeIconIds.length],
    }));

    if (found.positioning.marqueeItems.some((item) => !item.iconKey)) {
      const updated = await this.updateOne(
        { key: "landing" },
        {
          $set: {
            "positioning.marqueeItems": marqueeItems,
            updatedAt: new Date(),
          },
        }
      );
      return updated ?? found;
    }

    const legacyEmphasisSections = [
      "creatorFlowCta",
      "videoShowcase",
      "whyTuMedia",
      "faq",
      "finalCta",
    ] as const;
    const emphasisUpdates: Record<string, unknown> = {};
    const emphasisUnsets: Record<string, ""> = {};

    for (const section of legacyEmphasisSections) {
      const legacySection = found[section] as LandingSections[typeof section] & {
        emphasis?: string;
      };
      if (!legacySection.emphasis) continue;

      emphasisUpdates[`${section}.title`] = `${legacySection.title} ${legacySection.emphasis}`.trim();
      emphasisUnsets[`${section}.emphasis`] = "";
    }

    if (Object.keys(emphasisUpdates).length) {
      const updated = await this.updateOne(
        { key: "landing" },
        {
          $set: { ...emphasisUpdates, updatedAt: new Date() },
          $unset: emphasisUnsets,
        }
      );
      return updated ?? found;
    }

    const mediaUpdates: Record<string, string> = {};
    const mediaPaths = [
      "process.media.url",
      "creatorFlowCta.media.url",
      "whyTuMedia.media.url",
    ] as const;

    for (const path of mediaPaths) {
      const [section, media, field] = path.split(".") as [
        "process" | "creatorFlowCta" | "whyTuMedia",
        "media",
        "url",
      ];
      const url = found[section][media][field];
      const normalised = normaliseMediaUrl(url);
      if (url !== normalised) mediaUpdates[path] = normalised;
    }

    found.industriesPreview.items.forEach((item, index) => {
      const normalised = normaliseMediaUrl(item.image.url);
      if (item.image.url !== normalised) {
        mediaUpdates[`industriesPreview.items.${index}.image.url`] = normalised;
      }
    });

    if (Object.keys(mediaUpdates).length) {
      const updated = await this.updateOne(
        { key: "landing" },
        { $set: { ...mediaUpdates, updatedAt: new Date() } }
      );
      return updated ?? found;
    }

    return found;
  }
  async updateSection<K extends keyof LandingSections>(section: K, data: LandingSections[K], updatedBy: string) { return this.updateOne({ key: "landing" }, { $set: { [section]: data, updatedAt: new Date(), updatedBy } }); }
}
export const landingRepository = new LandingRepository();
