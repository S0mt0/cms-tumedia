import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { cache } from "react";
import { landingRepository } from "@/lib/db/repositories/landing/landing.repository";
import type { LandingSections } from "@/lib/types/landing";
import { FinalInvitationEditor } from "./_components/final-invitation-editor";

const getFinalInvitation = cache(async (): Promise<LandingSections["finalCta"]> => {
  const content = await landingRepository.get();
  return JSON.parse(JSON.stringify(content.finalCta)) as LandingSections["finalCta"];
});

export default async function LandingFinalInvitationPage() {
  const finalCta = await getFinalInvitation();
  return (
    <CmsEditorPageShell
      eyebrow="Landing page"
      title="Final invitation section"
      description="The closing conversion message and reassurance copy."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Landing", href: "/landing" },
        { label: "Final invitation" },
      ]}
      previewHref={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
    >
      <FinalInvitationEditor
        initial={finalCta}
        mediaPreviewBaseUrl={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}
      />
    </CmsEditorPageShell>
  );
}
