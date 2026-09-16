import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
export default async function LandingSeoPage(){const content=await landingRepository.get();return <CmsEditorPageShell eyebrow="Landing page" title="SEO" description="Optional search and sharing metadata for the landing page." breadcrumbs={[{label:"Overview",href:"/"},{label:"Landing",href:"/landing"},{label:"SEO"}]} previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}><PageSeoEditor page="landing" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
