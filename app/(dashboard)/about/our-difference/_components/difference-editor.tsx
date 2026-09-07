"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { DifferenceFields } from "./difference-fields";

export function DifferenceEditor({
  initial,
  mediaPreviewBaseUrl,
  title,
}: {
  initial: AboutSections["difference"];
  mediaPreviewBaseUrl: string;
  title: string;
}) {
  return (
    <AboutSectionEditor
      description="Build and order the differentiators displayed in the public About experience."
      initial={initial}
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      renderFields={({ value, readOnly, onChange }) => (
        <DifferenceFields readOnly={readOnly} value={value} onChange={onChange} />
      )}
      section="difference"
      title={title}
    />
  );
}
