import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { FaqEditor } from "./_components/faq-editor";

const getFaq = cache(async (): Promise<LandingSections["faq"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.faq)) as LandingSections["faq"];
});

export default async function LandingFaqPage() {
  const faq = await getFaq();
  return (
    <CmsEditorPageShell
      eyebrow="Landing page"
      title="Questions section"
      description="Frequently asked questions that help visitors decide what to do next."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: "Questions" },
      ]}
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
    >
      <FaqEditor
        initial={faq}
        mediaPreviewBaseUrl={
          process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
        }
      />
    </CmsEditorPageShell>
  );
}
