"use client";

import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AboutSections } from "@/lib/types/about";

type WhyWeExist = AboutSections["whyWeExist"];

function EditorLoadingState() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid min-h-56 place-items-center rounded-sm border border-dashed border-[#b8cec4] bg-[#f8fbf9] px-4 text-center"
      role="status"
    >
      <div>
        <LoaderCircle
          aria-hidden
          className="mx-auto size-5 animate-spin text-[#176d64]"
        />
        <p className="mt-3 text-sm font-semibold text-[#234640]">
          Preparing editor…
        </p>
        <p className="mt-1 text-xs text-[#61746d]">
          Your section copy will be ready in a moment.
        </p>
      </div>
    </div>
  );
}

const SectionTextEditor = dynamic(
  () =>
    import("@/components/forms/section-text-editor").then(
      (module) => module.SectionTextEditor
    ),
  {
    ssr: false,
    loading: EditorLoadingState,
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
