"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FilePenLine,
  Sparkles,
  Target,
  Layers3,
  BookOpenText,
  Globe2,
  Route,
  Flag,
  GalleryVerticalEnd,
  MessageCircleQuestion,
  MessagesSquare,
  PhoneCall,
  Send,
  UserRoundPlus,
  Newspaper,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useId, useState, useSyncExternalStore } from "react";

import { LogoutButton } from "@/components/layout/logout-button";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { landingSectionDefinitions } from "@/lib/constants/landing-sections";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const pageItems: NavItem[] = [
  { href: "/site", label: "Site & footer", icon: SlidersHorizontal },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const aboutSectionDefinitions = [
  { path: "hero", label: "Hero" },
  { path: "why-we-exist", label: "Why we exist" },
  { path: "our-perspective", label: "Our perspective" },
  { path: "our-difference", label: "Our difference" },
  { path: "our-story", label: "Our story" },
  { path: "global-capability", label: "Global capability" },
  { path: "audience-paths", label: "Audience paths" },
  { path: "closing", label: "Closing" },
] as const;

const aboutIcons: Record<(typeof aboutSectionDefinitions)[number]["path"], LucideIcon> = {
  hero: Sparkles, "why-we-exist": Target, "our-perspective": Layers3,
  "our-difference": Route, "our-story": BookOpenText, "global-capability": Globe2,
  "audience-paths": GalleryVerticalEnd, closing: Flag,
};

const contactSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "conversation", label: "Start a conversation", icon: MessageCircleQuestion },
  { path: "next-steps", label: "What happens next", icon: Route },
  { path: "submissions", label: "Submissions", icon: MessagesSquare },
  { path: "info", label: "Info", icon: PhoneCall },
] as const;
const joinSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "application", label: "Application", icon: UserRoundPlus },
  { path: "next-steps", label: "What happens next", icon: Route },
  { path: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { path: "submissions", label: "Submissions", icon: MessagesSquare },
] as const;
const blogSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "manage", label: "Manage posts", icon: BookOpenText },
] as const;
const industriesNavigation = [{ path: "hero", label: "Hero", icon: Sparkles }, { path: "introduction", label: "Introduction", icon: Target }, { path: "manage", label: "Industry directory", icon: Layers3 }] as const;
const workNavigation = [{ path: "hero", label: "Hero", icon: Sparkles }, { path: "collection", label: "Campaign reels", icon: GalleryVerticalEnd }, { path: "process", label: "Process", icon: Route }, { path: "faq", label: "FAQ", icon: MessageCircleQuestion }, { path: "invitation", label: "Invitation", icon: Flag }] as const;
const servicesNavigation = [{ path: "hero", label: "Hero", icon: Sparkles }, { path: "overview", label: "Overview", icon: Layers3 }, { path: "system", label: "Connected system", icon: Route }, { path: "deep-dives", label: "Deep dives", icon: BookOpenText }, { path: "process", label: "Process", icon: Target }, { path: "industries", label: "Industries", icon: Globe2 }, { path: "faq", label: "FAQ", icon: MessageCircleQuestion }, { path: "closing", label: "Final invitation", icon: Flag }] as const;

const landingIcons: Record<string, LucideIcon> = {
  hero: Sparkles, positioning: Target, "our-approach": Route, "creator-network": GalleryVerticalEnd,
  industries: Layers3, "selected-work": BookOpenText, "why-tu-media": Target,
  "blog-preview": BookOpenText, faq: MessageCircleQuestion, "final-invitation": Flag,
};

type DashboardShellProps = {
  children: React.ReactNode;
  email: string;
  name: string;
  image?: string | null;
};

function isActive(pathname: string, href: string) {
  const route = href.split("#")[0];
  return route === "/"
    ? pathname === "/"
    : pathname === route || pathname.startsWith(`${route}/`);
}

function usePersistedDisclosure(key: string, defaultOpen: boolean) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener("tu-media-cms-navigation-change", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(
          "tu-media-cms-navigation-change",
          onStoreChange
        );
      };
    },
    [key]
  );
  const getSnapshot = useCallback(() => {
    const saved = window.localStorage.getItem(key);
    return saved === null ? defaultOpen : saved === "true";
  }, [defaultOpen, key]);
  const getServerSnapshot = useCallback(() => defaultOpen, [defaultOpen]);
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    window.localStorage.setItem(key, String(!open));
    window.dispatchEvent(new Event("tu-media-cms-navigation-change"));
  }

  return [open, toggle] as const;
}

function NavLink({
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

function LandingNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, toggle] = usePersistedDisclosure(
    "tu-media-cms:nav:landing",
    pathname.startsWith("/landing")
  );
  const contentId = useId();
  const selected = pathname.startsWith("/landing");

  return (
    <section className="mt-5">
      <Button
        type="button"
        variant="ghost"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]",
          selected
            ? "bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white"
            : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
        )}
      >
        {selected ? (
          <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" />
        ) : null}
        <span className="flex items-center gap-3">
          <FilePenLine className="size-[17px]" aria-hidden />
          Landing page
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
        id={contentId}
        hidden={!open}
        className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3"
      >
        {landingSectionDefinitions.map((section) => (
          <NavLink
            key={section.key}
            item={{
              href: `/landing/${section.path}`,
              label: section.label,
              icon: landingIcons[section.path] ?? FilePenLine,
            }}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </section>
  );
}

function AboutNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [open, toggle] = usePersistedDisclosure("tu-media-cms:nav:about", pathname.startsWith("/about"));
  const contentId = useId();
  const selected = pathname.startsWith("/about");
  return <section className="mt-3"><Button type="button" variant="ghost" onClick={toggle} aria-expanded={open} aria-controls={contentId} className={cn("relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]", selected ? "bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white" : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]")}>{selected ? <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" /> : null}<span className="flex items-center gap-3"><FilePenLine className="size-[17px]" aria-hidden />About page</span><span className={cn("text-lg leading-none transition-transform duration-200", open && "rotate-45")} aria-hidden>+</span></Button><ul id={contentId} hidden={!open} className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3">{aboutSectionDefinitions.map((section) => <NavLink key={section.path} item={{ href: `/about/${section.path}`, label: section.label, icon: aboutIcons[section.path] }} pathname={pathname} onNavigate={onNavigate} />)}</ul></section>;
}

function ContactNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [open, toggle] = usePersistedDisclosure("tu-media-cms:nav:contact", pathname.startsWith("/contact"));
  const contentId = useId();
  const selected = pathname.startsWith("/contact");
  return <section className="mt-3"><Button type="button" variant="ghost" onClick={toggle} aria-expanded={open} aria-controls={contentId} className={cn("relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]", selected ? "bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white" : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]")}>{selected ? <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" /> : null}<span className="flex items-center gap-3"><Send className="size-[17px]" aria-hidden />Contact page</span><span className={cn("text-lg leading-none transition-transform duration-200", open && "rotate-45")} aria-hidden>+</span></Button><ul id={contentId} hidden={!open} className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3">{contactSectionDefinitions.map((section) => <NavLink key={section.path} item={{ href: `/contact/${section.path}`, label: section.label, icon: section.icon }} pathname={pathname} onNavigate={onNavigate} />)}</ul></section>;
}

function JoinNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [open, toggle] = usePersistedDisclosure("tu-media-cms:nav:join", pathname.startsWith("/join")); const contentId = useId(); const selected = pathname.startsWith("/join");
  return <section className="mt-3"><Button type="button" variant="ghost" onClick={toggle} aria-expanded={open} aria-controls={contentId} className={cn("relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]", selected ? "bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white" : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]")}>{selected ? <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" /> : null}<span className="flex items-center gap-3"><UserRoundPlus className="size-[17px]" aria-hidden />For creators</span><span className={cn("text-lg leading-none transition-transform duration-200", open && "rotate-45")} aria-hidden>+</span></Button><ul id={contentId} hidden={!open} className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3">{joinSectionDefinitions.map((section) => <NavLink key={section.path} item={{ href: `/join/${section.path}`, label: section.label, icon: section.icon }} pathname={pathname} onNavigate={onNavigate} />)}</ul></section>;
}

function BlogsNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [open, toggle] = usePersistedDisclosure("tu-media-cms:nav:blogs", pathname.startsWith("/blogs")); const contentId = useId(); const selected = pathname.startsWith("/blogs");
  return <section className="mt-3"><Button type="button" variant="ghost" onClick={toggle} aria-expanded={open} aria-controls={contentId} className={cn("relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]", selected ? "bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white" : "text-[#52605d] hover:bg-white/70 hover:text-[#163a37]")}>{selected ? <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-sm bg-[#f3c26b]" /> : null}<span className="flex items-center gap-3"><Newspaper className="size-[17px]" aria-hidden />Blogs</span><span className={cn("text-lg leading-none transition-transform duration-200", open && "rotate-45")} aria-hidden>+</span></Button><ul id={contentId} hidden={!open} className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3">{blogSectionDefinitions.map((section) => <NavLink key={section.path} item={{ href: `/blogs/${section.path}`, label: section.label, icon: section.icon }} pathname={pathname} onNavigate={onNavigate} />)}</ul></section>;
}

function ContentNavigation({ pathname, onNavigate, base, label, icon: Icon, items }: { pathname: string; onNavigate?: () => void; base: string; label: string; icon: LucideIcon; items: readonly { path: string; label: string; icon: LucideIcon }[] }) { const [open,toggle]=usePersistedDisclosure(`tu-media-cms:nav:${base}`,pathname.startsWith(`/${base}`)); const id=useId(); const selected=pathname.startsWith(`/${base}`); return <section className="mt-3"><Button type="button" variant="ghost" onClick={toggle} aria-expanded={open} aria-controls={id} className={cn("relative min-h-11 w-full justify-between rounded-md px-3 text-sm font-medium",selected?"bg-[#155e58] text-white hover:bg-[#155e58] hover:text-white":"text-[#52605d] hover:bg-white/70 hover:text-[#163a37]")}><span className="flex items-center gap-3"><Icon className="size-[17px]"/>{label}</span><span className={cn("text-lg",open&&"rotate-45")}>+</span></Button><ul id={id} hidden={!open} className="ml-6 mt-2 space-y-1 border-l border-[#b9cac3] pl-3">{items.map(item=><NavLink key={item.path} item={{href:`/${base}/${item.path}`,label:item.label,icon:item.icon}} pathname={pathname} onNavigate={onNavigate}/>)}</ul></section>; }

function SidebarContent({
  pathname,
  email,
  name,
  image,
  onNavigate,
  onCollapse,
}: {
  pathname: string;
  email: string;
  name: string;
  image?: string | null;
  onNavigate?: () => void;
  onCollapse?: () => void;
}) {
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
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md border border-[#c5d4cd] bg-white/75 p-3 outline-none transition-colors hover:border-[#8da89d] focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"
        >
          <UserAvatar name={name} image={image} className="size-9" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#171a1f]">
              {name}
            </span>
            <span className="block truncate text-xs text-slate-500">
              {email}
            </span>
          </span>
        </Link>
        <nav className="mt-5" aria-label="CMS navigation">
          <ul className="space-y-1">
            <NavLink
              item={{ href: "/", label: "Overview", icon: LayoutDashboard }}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </ul>
          <LandingNavigation pathname={pathname} onNavigate={onNavigate} />
      <AboutNavigation pathname={pathname} onNavigate={onNavigate} />
      <ContactNavigation pathname={pathname} onNavigate={onNavigate} />
      <JoinNavigation pathname={pathname} onNavigate={onNavigate} />
      <BlogsNavigation pathname={pathname} onNavigate={onNavigate} />
      <ContentNavigation pathname={pathname} onNavigate={onNavigate} base="industries" label="Industries" icon={Layers3} items={industriesNavigation} />
      <ContentNavigation pathname={pathname} onNavigate={onNavigate} base="work" label="Work" icon={BookOpenText} items={workNavigation} />
      <ContentNavigation pathname={pathname} onNavigate={onNavigate} base="services" label="Services" icon={Route} items={servicesNavigation} />
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
        <LogoutButton />
      </div>
    </>
  );
}

function CollapsedNavLink({
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

function CollapsedSidebar({
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
            className="w-10 h-10"
          />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onExpand}
          className="size-8 rounded-sm text-[#52605d] hover:bg-white/70 hover:text-[#163a37] mb-3"
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
      <div className="border-t border-[#c5d4cd] p-2">
        <Link
          href="/profile"
          className="size-11 overflow-hidden rounded-full border border-[#c5d4cd] bg-white/75 outline-none transition-colors hover:border-[#8da89d] focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"
          aria-label="Open profile"
          title="Profile"
        >
          <UserAvatar name={name} image={image} className="size-full" />
        </Link>
      </div>
    </>
  );
}

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
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[#171a1f]/25 lg:hidden"
          onClick={() => setMobileOpen(false)}
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
                onClick={() => setMobileOpen(false)}
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
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}
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
