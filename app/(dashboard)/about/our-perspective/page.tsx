import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../_components/about-section-editor";
const getSection = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).perspective)) as AboutSections["perspective"]);
export default async function PerspectivePage() { const initial = await getSection(); return <CmsEditorPageShell eyebrow="About page" title="Our perspective" description="The brand and creator needs that shape the TU Media approach." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Our perspective" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/about`}><AboutSectionEditor section="perspective" initial={initial} title="Perspective content" description="Edit the introduction and ordered brand and creator need lists." mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
