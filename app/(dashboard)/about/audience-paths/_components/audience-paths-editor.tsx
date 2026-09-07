"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { AudiencePathsFields } from "./audience-paths-fields";

export function AudiencePathsEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["audiencePaths"]; mediaPreviewBaseUrl: string }) {
  return <AboutSectionEditor section="audiencePaths" initial={initial} title="Audience paths" description="Keep each route clear, focused, and ready for its intended audience." mediaPreviewBaseUrl={mediaPreviewBaseUrl} renderFields={({ value, readOnly, onChange }) => <AudiencePathsFields baseUrl={mediaPreviewBaseUrl} value={value} readOnly={readOnly} onChange={onChange} />} />;
}
