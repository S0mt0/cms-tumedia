import { cache } from "react";

import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { blogContentRepository } from "@/lib/db/repositories/blog.repository";
import type { BlogHero } from "@/lib/types/blog";
import { BlogSectionEditor } from "../_components/blog-section-editor";

const getHero = cache(async () => JSON.parse(JSON.stringify((await blogContentRepository.get()).hero)) as BlogHero);

export default async function BlogsHeroPage() { const initial = await getHero(); const frontend = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"; return <CmsEditorPageShell eyebrow="Blogs" title="Blog hero" description="The opening content for the public editorial archive." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Blogs", href: "/blogs" }, { label: "Hero" }]} previewHref={`${frontend}/blogs`}><BlogSectionEditor initial={initial} /></CmsEditorPageShell>; }
