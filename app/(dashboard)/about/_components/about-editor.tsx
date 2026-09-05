"use client";

import { AboutSectionEditor } from "./about-section-editor";
import type { AboutSections } from "@/lib/types/about";

export function AboutEditor<TKey extends keyof AboutSections>(props: {
  section: TKey;
  initial: AboutSections[TKey];
  title: string;
  description: string;
  mediaPreviewBaseUrl: string;
}) {
  return <AboutSectionEditor {...props} />;
}
