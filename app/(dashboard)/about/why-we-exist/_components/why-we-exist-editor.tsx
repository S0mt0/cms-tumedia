"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { AboutWhyWeExistFields } from "./about-why-we-exist-fields";

export function WhyWeExistEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: AboutSections["whyWeExist"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <AboutSectionEditor
      section="whyWeExist"
      initial={initial}
      title="Why we exist content"
      description="Edit the full editorial copy and its approved inline formatting."
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      renderFields={({ value, readOnly, onChange }) => (
        <AboutWhyWeExistFields
          value={value}
          readOnly={readOnly}
          onChange={onChange}
        />
      )}
    />
  );
}
