"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function WhyTuMediaEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: LandingSections["whyTuMedia"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <LandingSectionEditor
      section="whyTuMedia"
      title="Why TU Media content"
      description="Edit the collaboration promise, supporting media, and key points."
      initial={initial}
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
    />
  );
}
