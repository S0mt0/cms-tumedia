import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { servicesRepository } from "@/lib/db/repositories/services.repository";
export default async function ServicesSeoPage(){const content=await servicesRepository.get();return <CmsEditorPageShell eyebrow="Services" title="SEO" description="Optional search and sharing metadata for services." breadcrumbs={[{label:"Overview",href:"/"},{label:"Services",href:"/services"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/services`}><PageSeoEditor page="services" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
