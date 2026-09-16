import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { workRepository } from "@/lib/db/repositories/work.repository";
export default async function WorkSeoPage(){const content=await workRepository.get();return <CmsEditorPageShell eyebrow="Work" title="SEO" description="Optional search and sharing metadata for work." breadcrumbs={[{label:"Overview",href:"/"},{label:"Work",href:"/work"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/projects`}><PageSeoEditor page="work" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
