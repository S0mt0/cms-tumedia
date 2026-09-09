import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { industriesRepository } from "@/lib/db/repositories/industries.repository";
import { IndustriesFields } from "../_components/industries-fields";
export default async function Page() {
  const { introduction } = await industriesRepository.get();
  return (
    <CmsEditorPageShell
      eyebrow="Industries"
      title="Introduction"
      description="Context and contact invitation before the directory."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Industries", href: "/industries" },
        { label: "Introduction" },
      ]}
    >
      <IndustriesFields
        section="introduction"
        initial={introduction}
        title="Introduction content"
        description="The copy and CTA above the industry accordion."
      />
    </CmsEditorPageShell>
  );
}
