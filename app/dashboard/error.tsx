"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("CMS dashboard error"); }, []);
  return <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#ff3d8d]">Workspace error</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.045em]">This area could not load.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">No content has been changed. Try loading this workspace area again.</p><Button className="mt-6" onClick={reset}>Try again</Button></section>;
}
