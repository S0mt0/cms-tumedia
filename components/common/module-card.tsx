import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModuleCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ModuleCard({ title, description, children, className }: ModuleCardProps) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white", className)}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-extrabold tracking-[-.015em] text-[#0b0d17]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
