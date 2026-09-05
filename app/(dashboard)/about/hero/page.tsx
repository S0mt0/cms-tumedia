import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { AboutEditor } from "../_components/about-editor";
const getHero = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).hero)) as AboutSections["hero"]);
export default async function AboutHeroPage() { const initial = await getHero(); return <CmsEditorPageShell eyebrow="About page" title="Hero section" description="The opening statement and editorial imagery for About." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Hero" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/about`}><AboutEditor section="hero" initial={initial} title="Hero content" description="Edit the introduction, call to action, background and collage." mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
