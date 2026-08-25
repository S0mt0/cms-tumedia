import type { ReactNode } from "react";

type CmsPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function CmsPageHeader({ title, description, actions }: CmsPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#7047eb]">Content management</p>
        <h1 className="mt-2 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold tracking-[-.05em] text-[#0b0d17]">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
