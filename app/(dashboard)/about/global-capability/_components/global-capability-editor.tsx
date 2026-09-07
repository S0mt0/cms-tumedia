"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { GlobalCapabilityFields } from "./global-capability-fields";

export function GlobalCapabilityEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: AboutSections["globalCapability"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <AboutSectionEditor
      section="globalCapability"
      initial={initial}
      title="Global capability"
      description="Arrange the locations and imagery that demonstrate campaign reach."
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      renderFields={({ value, readOnly, onChange }) => (
        <GlobalCapabilityFields
          baseUrl={mediaPreviewBaseUrl}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
        />
      )}
    />
  );
}
