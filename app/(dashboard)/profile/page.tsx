import { Mail } from "lucide-react";

import { CmsPageHeader } from "@/components/common/cms-page-header";
import { ModuleCard } from "@/components/common/module-card";
import { UserAvatar } from "@/components/common/user-avatar";
import { LogoutButton } from "@/components/layout/logout-button";
import { requireAdminSession } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const session = await requireAdminSession();

  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Profile"
        description="Your authenticated CMS account and workspace access."
      />
      <ModuleCard
        title="Account"
        description="This private workspace is available only to allowlisted administrators."
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={session.user.name}
              image={session.user.image}
              className="size-13 text-base"
            />
            <div>
              <p className="font-semibold text-[#171a1f]">
                {session.user.name}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="size-4" />
                {session.user.email}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <LogoutButton />
          </div>
        </div>
      </ModuleCard>
    </div>
  );
}
