"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const websiteItems: NavItem[] = [
  { href: "/landing", label: "Landing", icon: FileText },
  { href: "/about", label: "About", icon: FileText },
  { href: "/services", label: "Services", icon: FileText },
  { href: "/industries", label: "Industries", icon: FileText },
  { href: "/projects/manage", label: "Projects", icon: FolderOpen },
  { href: "/blogs/manage", label: "Blogs", icon: FileText },
  { href: "/contact", label: "Contact", icon: FileText },
  { href: "/join", label: "Join", icon: FileText },
  { href: "/privacy", label: "Privacy", icon: FileText },
  { href: "/terms", label: "Terms", icon: FileText },
  { href: "/site", label: "Site & footer", icon: Settings },
];

const operationsItems: NavItem[] = [
  {
    href: "/submissions/brand-inquiries",
    label: "Brand inquiries",
    icon: UsersRound,
  },
  {
    href: "/submissions/creator-applications",
    label: "Creator applications",
    icon: UsersRound,
  },
  { href: "/media", label: "Media library", icon: ImageIcon },
  { href: "/logs", label: "Activity logs", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

type DashboardShellProps = {
  children: React.ReactNode;
  email: string;
  name: string;
};

function active(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7047eb]",
              active(pathname, href)
                ? "bg-[#0b0d17] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#0b0d17]"
            )}
          >
            <Icon className="size-[17px]" aria-hidden />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SidebarContent({
  pathname,
  email,
  name,
  onNavigate,
}: {
  pathname: string;
  email: string;
  name: string;
  onNavigate?: () => void;
}) {
  const [websiteOpen, setWebsiteOpen] = useState(true);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <>
      <div className="flex h-20 items-center border-b border-slate-200 px-5">
        <Link href="/" onClick={onNavigate} aria-label="TU Media CMS dashboard">
          <Image
            src="/logo-black.png"
            alt="TU Media"
            width={136}
            height={34}
            className="h-auto w-30"
            priority
          />
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#fbfcff] p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eee9ff] text-xs font-extrabold text-[#7047eb]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#0b0d17]">{name}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
        </div>
        <nav className="mt-6" aria-label="CMS navigation">
          <p className="px-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-slate-400">
            Workspace
          </p>
          <div className="mt-2">
            <NavList
              items={[{ href: "/", label: "Dashboard", icon: LayoutDashboard }]}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </div>
          <button
            type="button"
            onClick={() => setWebsiteOpen((value) => !value)}
            className="mt-5 flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-[11px] font-extrabold uppercase tracking-[.14em] text-slate-400 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#7047eb]"
            aria-expanded={websiteOpen}
          >
            Website{" "}
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                websiteOpen && "rotate-180"
              )}
            />
          </button>
          {websiteOpen ? (
            <NavList
              items={websiteItems}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ) : null}
          <p className="mt-6 px-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-slate-400">
            Operations
          </p>
          <div className="mt-2">
            <NavList
              items={operationsItems}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </div>
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4">
        <LogoutButton />
      </div>
    </>
  );
}

export function DashboardShell({ children, email, name }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="min-h-dvh bg-[#f7f8fc] text-[#0b0d17]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col",
          collapsed ? "w-[76px]" : "w-[280px]"
        )}
      >
        {collapsed ? (
          <div className="flex flex-1 flex-col items-center py-5">
            <Link
              href="/"
              aria-label="TU Media CMS dashboard"
              className="grid size-10 place-items-center rounded-xl bg-[#0b0d17]"
            >
              <Image src="/logo-icon.png" alt="" width={24} height={24} />
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mt-6 grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Expand navigation"
            >
              <ChevronLeft className="size-5 rotate-180" />
            </button>
          </div>
        ) : (
          <SidebarContent pathname={pathname} email={email} name={name} />
        )}
        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="absolute -right-3 top-8 grid size-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-[#0b0d17]"
            aria-label="Collapse navigation"
          >
            <ChevronLeft className="size-4" />
          </button>
        ) : null}
      </aside>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 flex h-20 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6",
          collapsed ? "lg:left-[76px]" : "lg:left-[280px]"
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid size-11 place-items-center rounded-lg outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#7047eb] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <div className="relative hidden w-full max-w-md lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search CMS"
            placeholder="Search sections, projects, or posts"
            className="h-10 w-full rounded-xl border border-slate-200 bg-[#fbfcff] pl-9 pr-14 text-sm outline-none placeholder:text-slate-400 focus:border-[#7047eb] focus:ring-2 focus:ring-[#7047eb]/15"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            ⌘K
          </kbd>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#7047eb]"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" />
          </button>
          <div
            className="grid size-9 place-items-center rounded-full bg-[#eee9ff] text-xs font-extrabold text-[#7047eb]"
            aria-label={`${name} account`}
          >
            {initials}
          </div>
        </div>
      </header>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[#0b0d17]/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="flex h-full w-[min(21rem,88vw)] flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end border-b border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-11 place-items-center rounded-lg hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              email={email}
              name={name}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}
      <main
        className={cn(
          "min-h-dvh pt-20",
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
