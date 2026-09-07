"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";
import { PerspectiveNeedsColumn } from "./perspective-needs-column";

type Perspective = AboutSections["perspective"];

export function PerspectiveFields({
  value,
  readOnly,
  onChange,
}: {
  value: Perspective;
  readOnly: boolean;
  onChange: (next: Perspective) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FieldInput
          id="about-perspective-eyebrow"
          label="Eyebrow"
          readOnly={readOnly}
          value={value.eyebrow}
          onChange={(eyebrow) => onChange({ ...value, eyebrow })}
        />
        <FieldInput
          id="about-perspective-title"
          label="Title"
          readOnly={readOnly}
          value={value.title}
          onChange={(title) => onChange({ ...value, title })}
        />
      </div>

      <div>
        <Label htmlFor="about-perspective-description">Description</Label>
        <Textarea
          className="mt-2 min-h-28"
          id="about-perspective-description"
          onChange={(event) =>
            onChange({ ...value, description: event.target.value })
          }
          readOnly={readOnly}
          value={value.description}
        />
      </div>

      <section className="border-t border-[#d7e1dc] pt-6">
        <div className="mb-5">
          <p className="text-sm font-bold text-[#163a37]">Two sides, one standard</p>
          <p className="mt-1 text-sm text-[#61746d]">
            Keep each side focused. Add up to 10 concise partnership needs per column.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <PerspectiveNeedsColumn
            eyebrow={value.brandsEyebrow}
            eyebrowId="about-perspective-brands-eyebrow"
            items={value.brands}
            readOnly={readOnly}
            title={value.brandsTitle}
            titleId="about-perspective-brands-title"
            onEyebrowChange={(brandsEyebrow) =>
              onChange({ ...value, brandsEyebrow })
            }
            onItemsChange={(brands) => onChange({ ...value, brands })}
            onTitleChange={(brandsTitle) => onChange({ ...value, brandsTitle })}
            side="Brands"
          />
          <PerspectiveNeedsColumn
            eyebrow={value.creatorsEyebrow}
            eyebrowId="about-perspective-creators-eyebrow"
            items={value.creators}
            readOnly={readOnly}
            title={value.creatorsTitle}
            titleId="about-perspective-creators-title"
            onEyebrowChange={(creatorsEyebrow) =>
              onChange({ ...value, creatorsEyebrow })
            }
            onItemsChange={(creators) => onChange({ ...value, creators })}
            onTitleChange={(creatorsTitle) =>
              onChange({ ...value, creatorsTitle })
            }
            side="Creators"
          />
        </div>
      </section>

      <section className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#47635b]">
          Centre message
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <FieldInput
            id="about-perspective-bridge-eyebrow"
            label="Eyebrow"
            readOnly={readOnly}
            value={value.bridgeEyebrow}
            onChange={(bridgeEyebrow) =>
              onChange({ ...value, bridgeEyebrow })
            }
          />
          <FieldInput
            id="about-perspective-bridge-title"
            label="Title"
            readOnly={readOnly}
            value={value.bridgeTitle}
            onChange={(bridgeTitle) => onChange({ ...value, bridgeTitle })}
          />
        </div>
      </section>
    </div>
  );
}

function FieldInput({
  id,
  label,
  readOnly,
  value,
  onChange,
}: {
  id: string;
  label: string;
  readOnly: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        className="mt-2"
        id={id}
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
