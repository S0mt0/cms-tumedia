"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function IndustriesEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["industriesPreview"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="industriesPreview" title="Industries content" description="Edit the industry focus areas introduced on the landing page." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
