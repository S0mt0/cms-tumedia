"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CollapsedSidebar } from "./dashboard/collapsed-sidebar";
import { MobileDashboardNavigation } from "./dashboard/mobile-dashboard-navigation";
import { SidebarContent } from "./dashboard/sidebar-content";
import type { DashboardShellProps } from "./dashboard/types";
import { usePersistedDisclosure } from "./dashboard/use-persisted-disclosure";

export function DashboardShell({
  children,
  email,
  name,
  image,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, toggleCollapsed] = usePersistedDisclosure(
    "tu-media-cms:nav:collapsed",
    false
  );

  return (
    <div className="min-h-dvh bg-[#f7f5f0] text-[#163a37]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[#c5d4cd] bg-[#edf3f0] transition-[width] duration-200 lg:flex lg:flex-col",
          collapsed ? "w-[76px]" : "w-[280px]"
        )}
      >
        {collapsed ? (
          <CollapsedSidebar
            pathname={pathname}
            name={name}
            image={image}
            onExpand={toggleCollapsed}
          />
        ) : (
          <SidebarContent
            pathname={pathname}
            email={email}
            name={name}
            image={image}
            onCollapse={toggleCollapsed}
          />
        )}
      </aside>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center border-b border-[#c5d4cd] bg-[#f7f5f0]/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" aria-label="TU Media CMS dashboard">
          <Image
            src="/logo-black.png"
            alt="TU Media"
            width={136}
            height={34}
            className="h-auto w-27"
            priority
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={() => setMobileOpen(true)}
          className="ml-auto size-11 text-[#163a37]"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
      </header>
      <MobileDashboardNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        email={email}
        name={name}
        image={image}
      />
      <main
        className={cn(
          "min-h-dvh pt-16 transition-[margin] duration-200 lg:pt-0",
          collapsed ? "lg:ml-[76px]" : "lg:ml-[280px]"
        )}
      >
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
