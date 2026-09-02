import { CmsPageHeader } from "@/components/common/cms-page-header";
import { ModuleCard } from "@/components/common/module-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Dashboard"
        description="Your TU Media content operations will appear here as each CMS area is implemented."
      />
      <ModuleCard
        title="Foundation ready"
        description="Authentication, storage, cache, and integration foundations are configured. Landing editing is the next vertical slice."
      >
        <p className="text-sm leading-6 text-slate-600">
          No operational metrics are shown until they can be sourced from real
          CMS data.
        </p>
      </ModuleCard>
    </div>
  );
}
