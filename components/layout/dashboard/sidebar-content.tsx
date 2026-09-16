"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, PanelLeftClose, SearchCheck } from "lucide-react";

import { UserAvatar } from "@/components/common/user-avatar";
import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";

import {
  aboutIcons,
  aboutSectionDefinitions,
  blogSectionDefinitions,
  BookOpenText,
  contactSectionDefinitions,
  FilePenLine,
  industriesNavigation,
  landingIcons,
  landingSectionDefinitions,
  Layers3,
  Newspaper,
  pageItems,
  Route,
  Send,
  servicesNavigation,
  UserRoundPlus,
  joinSectionDefinitions,
  workNavigation,
} from "./navigation-config";
import { NavLink } from "./navigation-link";
import { NavigationGroup } from "./navigation-groups";

type Props = {
  pathname: string;
  email: string;
  name: string;
  image?: string | null;
  onNavigate?: () => void;
  onCollapse?: () => void;
};

export function SidebarContent({
  pathname,
  email,
  name,
  image,
  onNavigate,
  onCollapse,
}: Props) {
  const landingItems = [
    ...landingSectionDefinitions.map((section) => ({
      path: section.path,
      label: section.label,
      icon: landingIcons[section.path] ?? FilePenLine,
    })),
    { path: "seo", label: "SEO", icon: SearchCheck },
  ];
  return (
    <>
      <div className="flex h-[76px] items-center justify-between border-b border-[#c5d4cd] px-5">
        <Link href="/" onClick={onNavigate} aria-label="TU Media CMS dashboard">
          <Image
            src="/logo-black.png"
            alt="TU Media"
            width={136}
            height={34}
            className="h-auto w-29"
            priority
          />
        </Link>
        {onCollapse ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="size-9 rounded-sm text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
            aria-label="Collapse navigation"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
        <nav aria-label="CMS navigation">
          <ul className="space-y-1">
            <NavLink
              item={{ href: "/", label: "Overview", icon: LayoutDashboard }}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </ul>
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="landing"
            label="Landing page"
            icon={FilePenLine}
            items={landingItems}
            className="mt-5"
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="about"
            label="About page"
            icon={FilePenLine}
            items={aboutSectionDefinitions.map((section) => ({
              ...section,
              icon: aboutIcons[section.path],
            }))}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="contact"
            label="Contact page"
            icon={Send}
            items={contactSectionDefinitions}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="join"
            label="For creators"
            icon={UserRoundPlus}
            items={joinSectionDefinitions}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="blogs"
            label="Blogs"
            icon={Newspaper}
            items={blogSectionDefinitions}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="industries"
            label="Industries"
            icon={Layers3}
            items={industriesNavigation}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="work"
            label="Work"
            icon={BookOpenText}
            items={workNavigation}
          />
          <NavigationGroup
            pathname={pathname}
            onNavigate={onNavigate}
            base="services"
            label="Services"
            icon={Route}
            items={servicesNavigation}
          />
          <section className="mt-5">
            <p className="px-3 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
              Website
            </p>
            <ul className="mt-2 space-y-1">
              {pageItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </section>
        </nav>
      </div>
      <div className="border-t border-[#c5d4cd] p-3">
        <div className="rounded-lg border border-[#c5d4cd] bg-white/55 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              name={name}
              image={image}
              className="size-10 shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#171a1f]">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
