"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { StoryFields } from "./story-fields";

export function StoryEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["story"]; mediaPreviewBaseUrl: string }) {
  return <AboutSectionEditor section="story" initial={initial} title="Story content" description="Shape the editorial story and the principles that guide the work." mediaPreviewBaseUrl={mediaPreviewBaseUrl} renderFields={({ value, readOnly, onChange }) => <StoryFields value={value} readOnly={readOnly} onChange={onChange} />} />;
}
