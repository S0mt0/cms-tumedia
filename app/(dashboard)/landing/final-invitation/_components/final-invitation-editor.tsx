"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function FinalInvitationEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: LandingSections["finalCta"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <LandingSectionEditor
      section="finalCta"
      title="Final invitation content"
      description="Edit the closing conversion message and reassurance copy."
      initial={initial}
      mediaPreviewBaseUrl={mediaPreviewBaseUrl}
    />
  );
}
