import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { industriesRepository } from "@/lib/db/repositories/industries.repository";
import { IndustriesFields } from "../_components/industries-fields";
export default async function Page() {
  const { items } = await industriesRepository.get();
  return (
    <CmsEditorPageShell
      eyebrow="Industries"
      title="Industry directory"
      description="Manage each industry accordion and its video references."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Industries", href: "/industries" },
        { label: "Manage" },
      ]}
    >
      <IndustriesFields
        section="items"
        initial={items}
        title="Industry items"
        description="Add, edit, and remove industries before saving."
      />
    </CmsEditorPageShell>
  );
}
