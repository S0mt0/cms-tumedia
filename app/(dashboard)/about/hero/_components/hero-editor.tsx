"use client";

import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../../_components/about-section-editor";
import { AboutHeroFields } from "./about-hero-fields";

export function HeroEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["hero"]; mediaPreviewBaseUrl: string }) {
  return <AboutSectionEditor section="hero" initial={initial} title="Hero content" description="Edit the introduction, call to action, background and collage." mediaPreviewBaseUrl={mediaPreviewBaseUrl} renderFields={({ value, readOnly, onChange }) => <AboutHeroFields value={value} readOnly={readOnly} baseUrl={mediaPreviewBaseUrl} onChange={onChange} />} />;
}
