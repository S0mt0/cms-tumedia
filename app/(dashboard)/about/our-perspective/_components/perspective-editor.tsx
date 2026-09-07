"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { PerspectiveFields } from "./perspective-fields";

export function PerspectiveEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: AboutSections["perspective"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <AboutSectionEditor
      description="Shape the opening statement and the needs of both sides of a strong partnership."
      initial={initial}
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      renderFields={({ value, readOnly, onChange }) => (
        <PerspectiveFields
          readOnly={readOnly}
          value={value}
          onChange={onChange}
        />
      )}
      section="perspective"
      title="Perspective content"
    />
  );
}
