import Link from "next/link";
import { CmsPageHeader } from "@/components/common/cms-page-header";
import { SiteEditor } from "./_components/site-editor";
import { siteRepository } from "@/lib/db/repositories/site.repository";

export default async function SitePage() {
  const content = await siteRepository.get();
  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Site & footer"
        description="Manage shared labels, footer information, and default search metadata."
        actions={
          <Link
            href={process.env.FRONTEND_BASE_URL ?? "http://localhost:3000"}
            target="_blank"
            className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            View frontend
          </Link>
        }
      />
      <SiteEditor initial={JSON.parse(JSON.stringify(content))} />
    </div>
  );
}
