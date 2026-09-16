"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FilePenLine,
  LayoutDashboard,
  Newspaper,
  PanelLeftOpen,
  Send,
} from "lucide-react";
import { UserAvatar } from "@/components/common/user-avatar";
import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";
import { pageItems } from "./navigation-config";
import { CollapsedNavLink } from "./navigation-link";
import type { NavItem } from "./types";

export function CollapsedSidebar({
  pathname,
  name,
  image,
  onExpand,
}: {
  pathname: string;
  name: string;
  image?: string | null;
  onExpand: () => void;
}) {
  const items: NavItem[] = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/landing/hero", label: "Landing page", icon: FilePenLine },
    { href: "/about/hero", label: "About page", icon: FilePenLine },
    { href: "/contact/hero", label: "Contact page", icon: Send },
    { href: "/blogs/hero", label: "Blogs", icon: Newspaper },
    ...pageItems,
  ];
  return (
    <>
      <div className="flex h-[76px] flex-col items-center justify-center gap-1 border-b border-[#c5d4cd] py-3">
        <Link href="/" aria-label="TU Media CMS dashboard" className="mt-2">
          <Image
            src="/logo-icon.png"
            alt=""
            width={28}
            height={28}
            priority
            className="size-10"
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onExpand}
          className="mb-3 size-8 rounded-sm text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
          aria-label="Expand navigation"
        >
          <PanelLeftOpen className="size-5" />
        </Button>
      </div>
      <nav className="flex-1 px-2 py-4" aria-label="CMS navigation">
        <ul className="space-y-2">
          {items.map((item) => (
            <CollapsedNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-2 border-t border-[#c5d4cd] p-2">
        <UserAvatar
          name={name}
          image={image}
          className="size-11 border border-[#c5d4cd]"
        />
        <LogoutButton compact />
      </div>
    </>
  );
}
