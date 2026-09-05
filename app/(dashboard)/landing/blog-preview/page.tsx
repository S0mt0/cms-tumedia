import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { BlogPreviewEditor } from "./_components/blog-preview-editor";

const getBlogPreview = cache(
  async (): Promise<LandingSections["blogPreview"]> => {
    const content = await landingRepository.get();
    return JSON.parse(
      JSON.stringify(content.blogPreview)
    ) as LandingSections["blogPreview"];
  }
);

export default async function LandingBlogPreviewPage() {
  const blogPreview = await getBlogPreview();
  return (
    <CmsEditorPageShell
      eyebrow="Landing page"
      title="Blog preview section"
      description="The landing-page editorial introduction and post display limit."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: "Blog preview" },
      ]}
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
    >
      <BlogPreviewEditor
        initial={blogPreview}
        mediaPreviewBaseUrl={
          process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
        }
      />
    </CmsEditorPageShell>
  );
}
