import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { AboutSectionEditor } from "../_components/about-section-editor";
const getSection = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).closing)) as AboutSections["closing"]);
export default async function ClosingPage() { const initial = await getSection(); return <CmsEditorPageShell eyebrow="About page" title="Closing section" description="Industry focus, manifesto, and final contact invitation." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Closing" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/about`}><AboutSectionEditor section="closing" initial={initial} title="Closing content" description="Edit industry focus, manifesto, and final calls to action." mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
