import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { joinRepository } from "@/lib/db/repositories/join.repository";
export default async function JoinSeoPage(){const content=await joinRepository.get();return <CmsEditorPageShell eyebrow="For creators" title="SEO" description="Optional search and sharing metadata for the creator page." breadcrumbs={[{label:"Overview",href:"/"},{label:"For creators",href:"/join"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/join`}><PageSeoEditor page="join" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
