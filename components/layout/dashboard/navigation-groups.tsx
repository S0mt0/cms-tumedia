"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NavLink } from "./navigation-link";
import { usePersistedDisclosure } from "./use-persisted-disclosure";

type GroupItem = { path: string; label: string; icon: LucideIcon };

export function NavigationGroup({
  pathname,
  onNavigate,
  base,
  label,
  icon: Icon,
  items,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  base: string;
  label: string;
  icon: LucideIcon;
  items: readonly GroupItem[];
  className?: string;
}) {
  const [open, toggle] = usePersistedDisclosure(
    `tu-media-cms:nav:${base}`,
    pathname.startsWith(`/${base}`)
  );
  const id = useId();
  const selected = pathname.startsWith(`/${base}`);
  return (
    <section className={className ?? "mt-3"}>
      <Button
        type="button"
        variant="ghost"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]",
          selected
            ? "!bg-[#155e58] !text-white hover:!bg-[#155e58] hover:!text-white aria-expanded:!bg-[#155e58] aria-expanded:!text-white"
            : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
        )}
      >
        {selected ? (
          <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" />
        ) : null}
        <span className="flex items-center gap-3">
          <Icon className="size-[17px]" aria-hidden />
          {label}
        </span>
        <span
          className={cn(
            "text-lg leading-none transition-transform duration-200",
            open && "rotate-45"
          )}
          aria-hidden
        >
          +
        </span>
      </Button>
      <ul
        id={id}
        hidden={!open}
        className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3"
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            item={{
              href: `/${base}/${item.path}`,
              label: item.label,
              icon: item.icon,
            }}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </section>
  );
}
