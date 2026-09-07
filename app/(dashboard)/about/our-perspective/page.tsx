import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { PerspectiveEditor } from "./_components/perspective-editor";

const getSection = cache(
  async () =>
    JSON.parse(
      JSON.stringify((await aboutRepository.get()).perspective)
    ) as AboutSections["perspective"]
);

export default async function PerspectivePage() {
  const initial = await getSection();
  const mediaPreviewBaseUrl =
    process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";

  return (
    <CmsEditorPageShell
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "About", href: "/about" },
        { label: "Our perspective" },
      ]}
      description="The brand and creator needs that shape the TU Media approach."
      eyebrow="About page"
      previewHref={`${mediaPreviewBaseUrl}/about`}
      title="Our perspective"
    >
      <PerspectiveEditor
        initial={initial}
        mediaPreviewBaseUrl={mediaPreviewBaseUrl}
      />
    </CmsEditorPageShell>
  );
}
