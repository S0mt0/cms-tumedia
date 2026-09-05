"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function OurApproachEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["process"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="process" title="Our approach content" description="Edit how a brand brief moves through strategy and execution." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
