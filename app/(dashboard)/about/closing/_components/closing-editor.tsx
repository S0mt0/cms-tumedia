"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { ClosingFields } from "./closing-fields";

export function ClosingEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["closing"]; mediaPreviewBaseUrl: string }) {
  return <AboutSectionEditor section="closing" initial={initial} title="Closing content" description="Bring the industry focus, manifesto, and final invitation together." mediaPreviewBaseUrl={mediaPreviewBaseUrl} renderFields={({ value, readOnly, onChange }) => <ClosingFields value={value} readOnly={readOnly} onChange={onChange} />} />;
}
