import { notFound } from "next/navigation";

import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { blogPostRepository } from "@/lib/db/repositories/blog.repository";
import { BlogPostEditor } from "../../_components/blog-post-editor";

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = await blogPostRepository.bySlug(slug); if (!post) notFound(); const { title, excerpt, content, cover, tags, published, featured } = post; return <CmsEditorPageShell eyebrow="Blogs" title="Edit post" description={`Update “${post.title}” and save when it is ready.`} breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Blogs", href: "/blogs" }, { label: "Manage", href: "/blogs/manage" }, { label: post.title, href: `/blogs/manage/${post.slug}` }, { label: "Edit" }]}><BlogPostEditor slug={post.slug} initial={{ title, excerpt, content, cover, tags, published, featured }} mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"} /></CmsEditorPageShell>; }
