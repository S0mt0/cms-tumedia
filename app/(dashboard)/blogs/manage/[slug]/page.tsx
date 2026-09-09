import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { Button } from "@/components/ui/button";
import { blogPostRepository } from "@/lib/db/repositories/blog.repository";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = await blogPostRepository.bySlug(slug); if (!post) notFound(); return <CmsEditorPageShell eyebrow="Blogs" title={post.title} description={post.excerpt} breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Blogs", href: "/blogs" }, { label: "Manage", href: "/blogs/manage" }, { label: post.title }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/blogs/${post.slug}`}><article className="rounded-md border border-[#c5d4cd] bg-[#fffdfa] p-6"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#61746d]">{post.published ? "Published" : "Draft"} · Updated {post.updatedAt.toLocaleDateString("en", { dateStyle: "medium" })}</p><Button render={<Link href={`/blogs/manage/${post.slug}/edit`} />}><Pencil /> Edit post</Button></div><div className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} /></article></CmsEditorPageShell>; }
