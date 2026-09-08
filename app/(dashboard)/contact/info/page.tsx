import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { contactRepository } from "@/lib/db/repositories/contact.repository";
import type { ContactSections } from "@/lib/types/contact";
import { ContactInfoEditor } from "./_components/contact-info-editor";

const getInfo = cache(async () => JSON.parse(JSON.stringify((await contactRepository.get()).info)) as ContactSections["info"]);

export default async function ContactInfoPage() {
  const initial = await getInfo();
  return <CmsEditorPageShell eyebrow="Contact page" title="Contact information" description="Optional details displayed across the public site, including in the footer." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Contact", href: "/contact" }, { label: "Info" }]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}><ContactInfoEditor initial={initial} /></CmsEditorPageShell>;
}
