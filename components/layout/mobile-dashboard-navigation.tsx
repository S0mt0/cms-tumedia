"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/landing", label: "Landing" },
  { href: "/site", label: "Site settings" },
  { href: "/media", label: "Media" },
  { href: "/settings", label: "Settings" },
];

export function MobileDashboardNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button type="button" variant="ghost" size="icon-lg" onClick={() => setOpen(true)} className="size-11 text-slate-700 hover:bg-slate-100" aria-label="Open CMS navigation">
        <Menu className="size-5" aria-hidden="true" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[#0b0d17]/30" onClick={() => setOpen(false)}>
          <nav className="h-full w-[min(20rem,86vw)] bg-white p-5 shadow-xl" aria-label="CMS navigation" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-wide text-[#0b0d17]">TU Media CMS</p>
              <Button type="button" variant="ghost" size="icon-lg" onClick={() => setOpen(false)} className="size-11 text-slate-700 hover:bg-slate-100" aria-label="Close CMS navigation">
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <ul className="space-y-1">
              {navigation.map((item) => <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-[#eee9ff]">{item.label}</Link></li>)}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
