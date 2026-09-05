"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function FaqEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: LandingSections["faq"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <LandingSectionEditor
      section="faq"
      title="Questions content"
      description="Edit the questions visitors ask before reaching out."
      initial={initial}
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
    />
  );
}
