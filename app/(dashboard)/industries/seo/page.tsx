import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { industriesRepository } from "@/lib/db/repositories/industries.repository";
export default async function IndustriesSeoPage(){const content=await industriesRepository.get();return <CmsEditorPageShell eyebrow="Industries" title="SEO" description="Optional search and sharing metadata for industries." breadcrumbs={[{label:"Overview",href:"/"},{label:"Industries",href:"/industries"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/industries`}><PageSeoEditor page="industries" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
