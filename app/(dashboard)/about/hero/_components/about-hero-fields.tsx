"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StructuredField } from "../../_components/structured-field";
import { AboutHeroCollage } from "./about-hero-collage";
import type { AboutSections } from "@/lib/types/about";

type Hero = AboutSections["hero"];

export function AboutHeroFields({
  value,
  readOnly,
  baseUrl,
  onChange,
}: {
  value: Hero;
  readOnly: boolean;
  baseUrl: string;
  onChange: (next: Hero) => void;
}) {
  const cta = value.cta ?? { label: "", href: "" };
  const update = (patch: Partial<Hero>) => onChange({ ...value, ...patch });
  const updateCta = (patch: Partial<typeof cta>) => {
    const next = { ...cta, ...patch };
    update({ cta: next.label.trim() || next.href.trim() ? next : undefined });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,.8fr)]">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="about-hero-eyebrow">Eyebrow</Label>
            <Input
              id="about-hero-eyebrow"
              className="mt-2"
              readOnly={readOnly}
              value={value.eyebrow ?? ""}
              onChange={(event) =>
                update({ eyebrow: event.target.value || undefined })
              }
            />
          </div>
          <div>
            <Label htmlFor="about-hero-title">
              Title <span className="text-[#b0443f]">*</span>
            </Label>
            <Input
              id="about-hero-title"
              className="mt-2"
              readOnly={readOnly}
              value={value.title}
              onChange={(event) => update({ title: event.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="about-hero-emphasis">Emphasised words</Label>
            <Input
              id="about-hero-emphasis"
              className="mt-2"
              readOnly={readOnly}
              value={value.emphasis ?? ""}
              onChange={(event) =>
                update({ emphasis: event.target.value || undefined })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="about-hero-description">Description</Label>
          <Textarea
            id="about-hero-description"
            className="mt-2 min-h-28"
            readOnly={readOnly}
            value={value.description ?? ""}
            onChange={(event) =>
              update({ description: event.target.value || undefined })
            }
          />
        </div>
        <div>
          <Label htmlFor="about-hero-supporting-copy">Supporting copy</Label>
          <Textarea
            id="about-hero-supporting-copy"
            className="mt-2 min-h-28"
            readOnly={readOnly}
            value={value.supportingCopy ?? ""}
            onChange={(event) =>
              update({ supportingCopy: event.target.value || undefined })
            }
          />
        </div>
        <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
          <h3 className="text-sm font-bold text-[#163a37]">Call to action</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="about-hero-cta-label">Button label</Label>
              <Input
                id="about-hero-cta-label"
                className="mt-2"
                readOnly={readOnly}
                value={cta.label}
                onChange={(event) => updateCta({ label: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about-hero-cta-href">Destination</Label>
              <Input
                id="about-hero-cta-href"
                className="mt-2"
                readOnly={readOnly}
                value={cta.href}
                onChange={(event) => updateCta({ href: event.target.value })}
              />
            </div>
          </div>
        </section>
      </div>
      <aside className="space-y-5 border-t border-[#d7e1dc] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <StructuredField
          baseUrl={baseUrl}
          label="Background image"
          readOnly={readOnly}
          value={value.background ?? { url: "", alt: "" }}
          onChange={(background) =>
            update({ background: background as Hero["background"] })
          }
        />
        <AboutHeroCollage
          baseUrl={baseUrl}
          readOnly={readOnly}
          value={value.collage}
          onChange={(collage) => update({ collage })}
        />
      </aside>
    </div>
  );
}
