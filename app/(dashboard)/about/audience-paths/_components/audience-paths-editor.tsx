"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function AudiencePathsEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["audiencePaths"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="audiencePaths" initial={initial} title="Audience paths" description="Edit the brand and creator routes, calls to action, and creator background media." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
