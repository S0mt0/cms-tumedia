import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { contactRepository } from "@/lib/db/repositories/contact.repository";
export default async function ContactSeoPage(){const content=await contactRepository.get();return <CmsEditorPageShell eyebrow="Contact page" title="SEO" description="Optional search and sharing metadata for the contact page." breadcrumbs={[{label:"Overview",href:"/"},{label:"Contact",href:"/contact"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/contact`}><PageSeoEditor page="contact" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
