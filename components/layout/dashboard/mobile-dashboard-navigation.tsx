"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./sidebar-content";

export function MobileDashboardNavigation({
  open,
  onClose,
  pathname,
  email,
  name,
  image,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  email: string;
  name: string;
  image?: string | null;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-[#171a1f]/25 lg:hidden"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-[min(20rem,88vw)] flex-col border-r border-[#c5d4cd] bg-[#edf3f0]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end border-b border-[#c5d4cd] p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={onClose}
            className="size-11"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </Button>
        </div>
        <SidebarContent
          pathname={pathname}
          email={email}
          name={name}
          image={image}
          onNavigate={onClose}
        />
      </aside>
    </div>
  );
}
