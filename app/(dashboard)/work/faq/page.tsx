import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { workRepository } from "@/lib/db/repositories/work.repository";
import { WorkFields } from "../_components/work-fields";
export default async function Page() {
  const { faq } = await workRepository.get();
  return (
    <CmsEditorPageShell
      eyebrow="Work"
      title="FAQ"
      description="Manage questions displayed on the Work page."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Work", href: "/work" },
        { label: "FAQ" },
      ]}
    >
      <WorkFields
        section="faq"
        initial={faq}
        title="Frequently asked questions"
        description="Add or refine commonly asked campaign questions."
      />
    </CmsEditorPageShell>
  );
}
