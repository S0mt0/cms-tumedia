import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModuleCardProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ModuleCard({ id, title, description, children, className }: ModuleCardProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]", className)}>
      <div className="border-b border-[#d9e2dd] bg-[#f1f7f4] px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold tracking-[-.015em] text-[#163a37]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-[#5b6a65]">{description}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
