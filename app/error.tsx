"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("CMS global error"); }, []);
  return <main className="grid min-h-dvh place-items-center bg-[#f7f8fc] p-6"><section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#ff3d8d]">Something went wrong</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[#0b0d17]">The CMS needs a moment.</h1><p className="mt-4 text-sm leading-6 text-slate-600">Your content has not been changed. Try again, or return to the dashboard if this screen persists.</p><div className="mt-7 flex flex-wrap gap-3"><Button onClick={reset}>Try again</Button><Button variant="outline" render={<Link href="/" />}>Dashboard</Button></div></section></main>;
}
