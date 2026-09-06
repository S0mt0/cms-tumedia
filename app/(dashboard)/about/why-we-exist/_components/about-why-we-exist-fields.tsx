"use client";

import dynamic from "next/dynamic";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AboutSections } from "@/lib/types/about";

type WhyWeExist = AboutSections["whyWeExist"];

const SectionTextEditor = dynamic(
  () =>
    import("@/components/forms/section-text-editor").then(
      (module) => module.SectionTextEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-56 rounded-sm border border-[#b8cec4] bg-white" />
    ),
  }
);

export function AboutWhyWeExistFields({
  value,
  readOnly,
  onChange,
}: {
  value: WhyWeExist;
  readOnly: boolean;
  onChange: (next: WhyWeExist) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="about-why-eyebrow">Eyebrow</Label>
          <Input
            className="mt-2"
            id="about-why-eyebrow"
            onChange={(event) =>
              onChange({ ...value, eyebrow: event.target.value })
            }
            readOnly={readOnly}
            value={value.eyebrow}
          />
        </div>
        <div>
          <Label htmlFor="about-why-title">Title</Label>
          <Input
            className="mt-2"
            id="about-why-title"
            onChange={(event) =>
              onChange({ ...value, title: event.target.value })
            }
            readOnly={readOnly}
            value={value.title}
          />
        </div>
      </div>
      <SectionTextEditor
        description="Use paragraphs to structure the editorial copy. Only the available formatting is published."
        id="about-why-copy"
        label="Section copy"
        onChange={(body) => onChange({ ...value, body })}
        readOnly={readOnly}
        value={value.body}
      />
    </div>
  );
}
