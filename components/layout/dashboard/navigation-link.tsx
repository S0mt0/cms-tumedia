"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import type { NavItem } from "./types";

export function isActive(pathname: string, href: string) {
  const route = href.split("#")[0];
  return route === "/"
    ? pathname === "/"
    : pathname === route || pathname.startsWith(`${route}/`);
}

export function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const selected = isActive(pathname, item.href);
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "relative flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1d8f7a]",
          selected
            ? "bg-[#155e58] text-white"
            : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
        )}
      >
        {selected ? (
          <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" />
        ) : null}
        <Icon className="size-[17px]" aria-hidden />
        {item.label}
      </Link>
    </li>
  );
}

export function CollapsedNavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const selected = isActive(pathname, item.href);
  return (
    <li>
      <Link
        href={item.href}
        aria-label={item.label}
        title={item.label}
        className={cn(
          "relative grid size-11 place-items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1d8f7a]",
          selected
            ? "bg-[#155e58] text-white"
            : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
        )}
      >
        {selected ? (
          <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" />
        ) : null}
        <Icon className="size-[18px]" aria-hidden />
      </Link>
    </li>
  );
}
