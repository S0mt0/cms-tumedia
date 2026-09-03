import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdminSession } from "@/lib/auth/guards";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <DashboardShell
      email={session.user.email}
      name={session.user.name}
      image={session.user.image}
    >
      {children}
    </DashboardShell>
  );
}
