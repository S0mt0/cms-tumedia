"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function GlobalCapabilityEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["globalCapability"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="globalCapability" initial={initial} title="Global capability" description="Add, remove, edit, reorder and illustrate capability locations." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
