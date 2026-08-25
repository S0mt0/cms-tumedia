import Link from "next/link";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/landing", label: "Landing" },
  { href: "/site", label: "Site settings" },
  { href: "/media", label: "Media" },
  { href: "/settings", label: "Settings" },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 text-sm font-semibold tracking-wide text-[#0b0d17]">
        TU Media CMS
      </div>
      <nav className="p-3" aria-label="CMS navigation">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-[#eee9ff] hover:text-[#0b0d17] focus-visible:ring-2 focus-visible:ring-[#7047eb]"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
