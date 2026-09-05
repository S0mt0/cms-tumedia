"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function CreatorNetworkEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["creatorFlowCta"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="creatorFlowCta" title="Creator network content" description="Edit the invitation for creators to join the TU Media network." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
