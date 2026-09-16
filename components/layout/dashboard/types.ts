import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export type DashboardShellProps = {
  children: ReactNode;
  email: string;
  name: string;
  image?: string | null;
};
