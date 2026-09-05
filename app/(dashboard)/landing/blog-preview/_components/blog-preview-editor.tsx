"use client";

import { LandingSectionEditor } from "../../_components/landing-section-editor";
import type { LandingSections } from "@/lib/types/landing";

export function BlogPreviewEditor({ initial, mediaPreviewBaseUrl }: { initial: LandingSections["blogPreview"]; mediaPreviewBaseUrl: string }) {
  return <LandingSectionEditor section="blogPreview" title="Blog preview content" description="Edit the editorial introduction and post display limit." initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} />;
}
