import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { joinRepository } from "@/lib/db/repositories/join.repository";
import type { JoinSections } from "@/lib/types/join";
import { JoinHeroEditor } from "./_components/join-hero-editor";
const getHero = cache(async () => JSON.parse(JSON.stringify((await joinRepository.get()).hero)) as JoinSections["hero"]);
export default async function JoinHeroPage() { const initial = await getHero(); const frontend = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"; return <CmsEditorPageShell eyebrow="For creators" title="Hero section" description="The first invitation and its image or video treatment." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "For creators", href: "/join" }, { label: "Hero" }]} previewHref={`${frontend}/join`}><JoinHeroEditor initial={initial} mediaPreviewBaseUrl={frontend} /></CmsEditorPageShell>; }
