import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { StoryEditor } from "./_components/story-editor";

const getSection = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).story)) as AboutSections["story"]);

export default async function StoryPage() {
  const initial = await getSection();
  const mediaPreviewBaseUrl = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";

  return <CmsEditorPageShell eyebrow="About page" title="Our story" description="The story and principles presented on the public About page." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Our story" }]} previewHref={`${mediaPreviewBaseUrl}/about`}><StoryEditor initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} /></CmsEditorPageShell>;
}
