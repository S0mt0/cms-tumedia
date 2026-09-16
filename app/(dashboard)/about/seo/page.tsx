import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
export default async function AboutSeoPage(){const content=await aboutRepository.get();return <CmsEditorPageShell eyebrow="About page" title="SEO" description="Optional search and sharing metadata for the About page." breadcrumbs={[{label:"Overview",href:"/"},{label:"About",href:"/about"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/about`}><PageSeoEditor page="about" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
