import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { WhyWeExistEditor } from "./_components/why-we-exist-editor";
const getSection = cache(
  async () =>
    JSON.parse(
      JSON.stringify((await aboutRepository.get()).whyWeExist)
    ) as AboutSections["whyWeExist"]
);
export default async function WhyWeExistPage() {
  const initial = await getSection();
  return (
    <CmsEditorPageShell
      eyebrow="About page"
      title="Why we exist"
      description="The purpose and founding perspective behind TU Media."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "About", href: "/about" },
        { label: "Why we exist" },
      ]}
      previewHref={`${
        process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
      }/about`}
    >
      <WhyWeExistEditor
        initial={initial}
        mediaPreviewBaseUrl={
          process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
        }
      />
    </CmsEditorPageShell>
  );
}
