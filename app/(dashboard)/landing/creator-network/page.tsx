import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { CreatorNetworkEditor } from "./_components/creator-network-editor";

const getCreatorNetwork = cache(
  async (): Promise<LandingSections["creatorFlowCta"]> => {
    const content = await landingRepository.get();
    return JSON.parse(
      JSON.stringify(content.creatorFlowCta)
    ) as LandingSections["creatorFlowCta"];
  }
);

export default async function LandingCreatorNetworkPage() {
  const creatorFlowCta = await getCreatorNetwork();
  return (
    <CmsEditorPageShell
      eyebrow="Landing page"
      title="Creator network section"
      description="The invitation for creators to join the TU Media network."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: "Creator network" },
      ]}
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
    >
      <CreatorNetworkEditor
        initial={creatorFlowCta}
        mediaPreviewBaseUrl={
          process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"
        }
      />
    </CmsEditorPageShell>
  );
}
