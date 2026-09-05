import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { PositioningEditor } from "./_components/positioning-editor";

const getPositioning = cache(async (): Promise<LandingSections["positioning"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.positioning)) as LandingSections["positioning"];
});

export default async function LandingPositioningPage() {
  const positioning = await getPositioning();
  return <CmsEditorPageShell eyebrow="Landing page" title="Positioning section" description="The point of view, proof points, and moving topic strip." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Landing", href: "/landing" }, { label: "Positioning" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}><PositioningEditor initial={positioning} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>;
}
