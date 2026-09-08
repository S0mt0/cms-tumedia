import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { contactRepository } from "@/lib/db/repositories/contact.repository";
import type { ContactSections } from "@/lib/types/contact";
import { NextStepsEditor } from "./_components/next-steps-editor";

const getNextSteps = cache(async () => JSON.parse(JSON.stringify((await contactRepository.get()).nextSteps)) as ContactSections["nextSteps"]);

export default async function ContactNextStepsPage() {
  const initial = await getNextSteps();
  return <CmsEditorPageShell eyebrow="Contact page" title="What happens next" description="The ordered next steps that set expectations after an enquiry." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Contact", href: "/contact" }, { label: "What happens next" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/contact`}><NextStepsEditor initial={initial} /></CmsEditorPageShell>;
}
