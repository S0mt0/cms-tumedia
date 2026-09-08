import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { contactRepository } from "@/lib/db/repositories/contact.repository";
import type { ContactSections } from "@/lib/types/contact";
import { ContactHeroEditor } from "./_components/contact-hero-editor";

const getHero = cache(async () => JSON.parse(JSON.stringify((await contactRepository.get()).hero)) as ContactSections["hero"]);

export default async function ContactHeroPage() {
  const initial = await getHero();
  const frontend = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";
  return <CmsEditorPageShell eyebrow="Contact page" title="Hero section" description="The opening promise and focus points for brand enquiries." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Contact", href: "/contact" }, { label: "Hero" }]} previewHref={`${frontend}/contact`}><ContactHeroEditor initial={initial} /></CmsEditorPageShell>;
}
