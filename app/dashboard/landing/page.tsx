import Link from "next/link";
import { CmsPageHeader } from "@/components/common/cms-page-header";
import { LandingEditor } from "./_components/landing-editor";
import { landingRepository } from "@/lib/db/repositories/landing.repository";
export default async function LandingPage() {
  const content = await landingRepository.get();
  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Landing page"
        description="Edit the public homepage in its rendered section order."
        actions={
          <Link
            className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
            href={process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}
            target="_blank"
          >
            View frontend
          </Link>
        }
      />
      <LandingEditor initial={JSON.parse(JSON.stringify(content))} />
    </div>
  );
}
