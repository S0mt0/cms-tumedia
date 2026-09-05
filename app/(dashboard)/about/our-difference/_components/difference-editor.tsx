"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function DifferenceEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["difference"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="difference" initial={initial} title="Differentiators" description="Add, remove, edit, and reorder differentiator cards and their details." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
