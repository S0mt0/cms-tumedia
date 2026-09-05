"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function PositioningEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["positioning"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="positioning" title="Positioning content" description="Edit the point of view, proof points, and moving topic strip." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
