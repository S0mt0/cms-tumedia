import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { cache } from "react";

import { HeroEditor } from "./_components/hero-editor";

const getHero = cache(async (): Promise<LandingSections["hero"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.hero)) as LandingSections["hero"];
});

export default async function LandingHeroPage() {
  const hero = await getHero();

  return (
    <CmsEditorPageShell
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: "Hero" },
      ]}
      description="The opening statement, calls to action, and background media."
      eyebrow="Landing page"
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
      title="Hero section"
    >
      <HeroEditor
        initial={hero}
        mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}
      />
    </CmsEditorPageShell>
  );
}
