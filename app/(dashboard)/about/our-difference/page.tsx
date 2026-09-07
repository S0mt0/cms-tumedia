import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { DifferenceEditor } from "./_components/difference-editor";
const getSection = cache(
  async () =>
    JSON.parse(
      JSON.stringify((await aboutRepository.get()).difference)
    ) as AboutSections["difference"]
);
export default async function DifferencePage() {
  const initial = await getSection();
  const mediaPreviewBaseUrl = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";

  return (
    <CmsEditorPageShell
      eyebrow="About page"
      title="Our difference"
      description="The ordered differentiators that make the model distinct."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "About", href: "/about" },
        { label: "Our difference" },
      ]}
      previewHref={`${mediaPreviewBaseUrl}/about`}
    >
      <DifferenceEditor
        initial={initial}
        mediaPreviewBaseUrl={mediaPreviewBaseUrl}
        title="Differentiators"
      />
    </CmsEditorPageShell>
  );
}
