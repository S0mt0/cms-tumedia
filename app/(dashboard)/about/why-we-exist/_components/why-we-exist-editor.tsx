"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function WhyWeExistEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["whyWeExist"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="whyWeExist" initial={initial} title="Why we exist content" description="Edit and order the editorial paragraphs." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
