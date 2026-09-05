"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function StoryEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["story"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="story" initial={initial} title="Story content" description="Edit and reorder the story paragraphs and principle cards." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
