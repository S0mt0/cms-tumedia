"use client";

import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteAccountCard({ onDelete }: { onDelete: () => void }) {
  return <section className="self-start rounded-xl border border-[#dba89e] bg-[#fff3f1] p-5"><p className="text-sm font-bold uppercase tracking-[.12em] text-[#a55353]">Danger zone</p><h2 className="mt-3 text-2xl font-bold text-[#6f302d]">Delete your CMS account</h2><p className="mt-3 text-sm leading-6 text-[#7d4a46]">This removes your user, sessions, and linked authentication accounts. Content remains intact.</p><Button type="button" variant="destructive" className="mt-6 w-full" onClick={onDelete}><UserX aria-hidden />Delete my account</Button></section>;
}
