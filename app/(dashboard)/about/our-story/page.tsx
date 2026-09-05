import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { AboutEditor } from "../_components/about-editor";
const getSection = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).story)) as AboutSections["story"]);
export default async function StoryPage() { const initial = await getSection(); return <CmsEditorPageShell eyebrow="About page" title="Our story" description="The story and principles presented on the public About page." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Our story" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/about`}><AboutEditor section="story" initial={initial} title="Story content" description="Edit and reorder the story paragraphs and principle cards." mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
