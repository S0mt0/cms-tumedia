"use client";
import { AboutEditor } from "../../_components/about-editor";
import type { AboutSections } from "@/lib/types/about";
export function HeroEditor({ initial, mediaPreviewBaseUrl }: { initial: AboutSections["hero"]; mediaPreviewBaseUrl: string }) { return <AboutEditor section="hero" initial={initial} title="Hero content" description="Edit the introduction, call to action, background and collage." mediaPreviewBaseUrl={mediaPreviewBaseUrl} />; }
