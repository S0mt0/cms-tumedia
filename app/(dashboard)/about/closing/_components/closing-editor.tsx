"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function ClosingEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["closing"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="closing" initial={initial} title="Closing content" description="Edit industry focus, manifesto, and final calls to action." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
