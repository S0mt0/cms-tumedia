import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { PageSeoEditor } from "@/components/forms/page-seo-editor";
import { blogContentRepository } from "@/lib/db/repositories/blog.repository";
export default async function BlogsSeoPage(){const content=await blogContentRepository.get();return <CmsEditorPageShell eyebrow="Blogs" title="SEO" description="Optional search and sharing metadata for the blog archive." breadcrumbs={[{label:"Overview",href:"/"},{label:"Blogs",href:"/blogs"},{label:"SEO"}]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/blogs`}><PageSeoEditor page="blogs" initial={content.seo} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/></CmsEditorPageShell>;}
