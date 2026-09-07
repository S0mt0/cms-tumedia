import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { aboutRepository } from "@/lib/db/repositories/about.repository";
import type { AboutSections } from "@/lib/types/about";
import { GlobalCapabilityEditor } from "./_components/global-capability-editor";

const getSection = cache(async () => JSON.parse(JSON.stringify((await aboutRepository.get()).globalCapability)) as AboutSections["globalCapability"]);

export default async function GlobalCapabilityPage() {
  const initial = await getSection();
  const mediaPreviewBaseUrl = process.env.FRONTEND_BASE_URL ?? "http://localhost:3001";

  return <CmsEditorPageShell eyebrow="About page" title="Global capability" description="The locations and editorial images that demonstrate global reach." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "About", href: "/about" }, { label: "Global capability" }]} previewHref={`${mediaPreviewBaseUrl}/about`}><GlobalCapabilityEditor initial={initial} mediaPreviewBaseUrl={mediaPreviewBaseUrl} /></CmsEditorPageShell>;
}
