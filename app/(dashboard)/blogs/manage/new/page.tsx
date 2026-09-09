import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { BlogPostEditor } from "../_components/blog-post-editor";

export default function NewBlogPostPage() { return <CmsEditorPageShell eyebrow="Blogs" title="New post" description="Compose an article, add media, and choose when it is visible publicly." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Blogs", href: "/blogs" }, { label: "Manage", href: "/blogs/manage" }, { label: "New post" }]}><BlogPostEditor mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
