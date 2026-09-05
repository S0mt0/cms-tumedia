"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function SelectedWorkEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["videoShowcase"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="videoShowcase" title="Selected work content" description="Edit the featured campaign video and supporting invitation." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
