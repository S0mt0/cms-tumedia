import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { AudiencePathsEditor } from "./_components/audience-paths-editor";
const getSection = cache(
  async () =>
    JSON.parse(
      JSON.stringify((await aboutRepository.get()).audiencePaths)
    ) as AboutSections["audiencePaths"]
);
export default async function AudiencePathsPage() {
  const initial = await getSection();
  const mediaPreviewBaseUrl = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";

  return (
    <CmsEditorPageShell
      eyebrow="About page"
      title="Audience paths"
      description="The distinct paths for brands and creators."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "About", href: "/about" },
        { label: "Audience paths" },
      ]}
      previewHref={`${mediaPreviewBaseUrl}/about`}
    >
      <AudiencePathsEditor
        initial={initial}
        mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      />
    </CmsEditorPageShell>
  );
}
