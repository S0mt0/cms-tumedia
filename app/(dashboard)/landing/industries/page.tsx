import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { IndustriesEditor } from "./_components/industries-editor";

const getIndustries = cache(async (): Promise<LandingSections["industriesPreview"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.industriesPreview)) as LandingSections["industriesPreview"];
});

export default async function LandingIndustriesPage() {
  const industries = await getIndustries();
  return <CmsEditorPageShell eyebrow="Landing page" title="Industries preview" description="The industry focus areas introduced on the landing page." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Landing", href: "/landing" }, { label: "Industries" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}><IndustriesEditor initial={industries} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>;
}
