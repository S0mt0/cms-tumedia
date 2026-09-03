import { notFound } from "next/navigation";

import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import {
  getLandingSectionDefinition,
  landingSectionDefinitions,
} from "@/lib/constants/landing-sections";
import { landingRepository } from "@/lib/db/repositories/landing.repository";

import { LandingSectionEditor } from "../_components/landing-section-editor";
import { LandingHeroEditor } from "../_components/landing-hero-editor";

type LandingSectionPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return landingSectionDefinitions.map(({ key }) => ({ section: key }));
}

export default async function LandingSectionPage({
  params,
}: LandingSectionPageProps) {
  const { section: sectionSlug } = await params;
  const section = getLandingSectionDefinition(sectionSlug);

  if (!section) notFound();

  const content = await landingRepository.get();
  const initial = JSON.parse(JSON.stringify(content[section.key]));

  return (
    <CmsEditorPageShell
      eyebrow="Landing page"
      title={section.title}
      description={section.description}
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: section.label },
      ]}
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
    >
      {section.key === "hero" ? (
        <LandingHeroEditor
          initial={initial as typeof content.hero}
          mediaPreviewBaseUrl={
            process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
          }
        />
      ) : (
        <LandingSectionEditor
          section={section.key}
          title="Section content"
          description="Edit the structured content that feeds this public landing-page section."
          initial={initial}
          mediaPreviewBaseUrl={
            process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
          }
        />
      )}
    </CmsEditorPageShell>
  );
}
