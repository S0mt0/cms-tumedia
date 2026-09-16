import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { legalRepository } from "@/lib/db/repositories/legal.repository";
export default async function LegalSeoPage(){const content=await legalRepository.get();return <CmsEditorPageShell eyebrow="Terms & privacy" title="SEO" description="Optional search and sharing metadata for legal pages." breadcrumbs={[{label:"Overview",href:"/"},{label:"Terms & privacy",href:"/legal"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/privacy`}><PageSeoEditor page="legal" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
