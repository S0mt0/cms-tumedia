"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function PerspectiveEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["perspective"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="perspective" initial={initial} title="Perspective content" description="Edit the introduction and ordered brand and creator need lists." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
