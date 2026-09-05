import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { WhyTuMediaEditor } from "./_components/why-tu-media-editor";

const getWhyTuMedia = cache(async (): Promise<LandingSections["whyTuMedia"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.whyTuMedia)) as LandingSections["whyTuMedia"];
});

export default async function LandingWhyTuMediaPage() {
  const whyTuMedia = await getWhyTuMedia();
  return <CmsEditorPageShell eyebrow="Landing page" title="Why TU Media section" description="The collaboration promise, supporting media, and key points." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Landing", href: "/landing" }, { label: "Why TU Media" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}><WhyTuMediaEditor initial={whyTuMedia} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>;
}
