import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { OurApproachEditor } from "./_components/our-approach-editor";

const getOurApproach = cache(async (): Promise<LandingSections["process"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.process)) as LandingSections["process"];
});

export default async function LandingOurApproachPage() {
  const processSection = await getOurApproach();
  return <CmsEditorPageShell eyebrow="Landing page" title="Process section" description="How a brand brief moves through strategy and execution." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Landing", href: "/landing" }, { label: "Our approach" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}><OurApproachEditor initial={processSection} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>;
}
