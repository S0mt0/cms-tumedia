import { Fragment, type ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Breadcrumb = {
  label: string;
  href?: string;
};

type CmsEditorPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Breadcrumb[];
  previewHref?: string;
  children: ReactNode;
};

export function CmsEditorPageShell({
  eyebrow,
  title,
  description,
  breadcrumbs,
  previewHref,
  children,
}: CmsEditorPageShellProps) {
  const currentBreadcrumb = breadcrumbs.at(-1);
  const parentBreadcrumb = [...breadcrumbs]
    .reverse()
    .find((breadcrumb) => breadcrumb.href);

  return (
    <div className="space-y-5">
      <header className="border border-[#c5d4cd] bg-[#fffdfa]">
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[#d9e2dd] px-4 sm:px-5">
          <div className="flex min-w-0 items-center sm:hidden">
            {parentBreadcrumb?.href ? (
              <Link
                href={parentBreadcrumb.href}
                className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-[#315b55] outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {parentBreadcrumb.label}
              </Link>
            ) : null}
            {currentBreadcrumb ? (
              <span className="ml-3 truncate border-l border-[#d9e2dd] pl-3 text-sm font-medium text-[#163a37]">
                {currentBreadcrumb.label}
              </span>
            ) : null}
          </div>
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-xs font-medium text-[#64736e]">
              {breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.label}>
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink
                        render={
                          <Link
                            href={breadcrumb.href}
                            className="outline-none focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"
                          />
                        }
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[#c5d4cd] bg-white px-3 text-sm font-medium text-[#163a37] outline-none transition-colors hover:bg-[#edf3f0] focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"
            >
              View frontend
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
        <div className="px-4 py-5 sm:px-5 sm:py-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#16736c]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#163a37] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b6a65]">
            {description}
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
