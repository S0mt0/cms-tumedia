import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { SelectedWorkEditor } from "./_components/selected-work-editor";

const getSelectedWork = cache(async (): Promise<LandingSections["videoShowcase"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.videoShowcase)) as LandingSections["videoShowcase"];
});

export default async function LandingSelectedWorkPage() {
  const videoShowcase = await getSelectedWork();
  return <CmsEditorPageShell eyebrow="Landing page" title="Selected work section" description="The featured campaign video and its supporting invitation." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Landing", href: "/landing" }, { label: "Selected work" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}><SelectedWorkEditor initial={videoShowcase} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>;
}
