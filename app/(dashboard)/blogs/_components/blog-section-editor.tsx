"use client";

import { useState, useTransition } from "react";

import { notifyActionResult } from "@/components/common/action-toast";
import { Button } from "@/components/ui/button";
import { saveBlogHero } from "@/lib/actions/blog.actions";
import type { BlogHero } from "@/lib/types/blog";

export function BlogSectionEditor({ initial }: { initial: BlogHero }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const update = (key: keyof BlogHero, next: string) => setValue((current) => ({ ...current, [key]: next || undefined } as BlogHero));
  const save = () => startTransition(async () => { const result = await saveBlogHero(value); notifyActionResult(result); if (result.success) setEditing(false); });
  return <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]"><div className="flex items-center justify-between gap-4 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4"><div><h2 className="font-bold text-[#163a37]">Blog hero</h2><p className="mt-1 text-sm text-[#61746d]">Set the opening copy for the public blog archive.</p></div><Button type="button" variant="outline" onClick={() => editing ? save() : setEditing(true)} disabled={pending}>{editing ? (pending ? "Saving…" : "Save changes") : "Edit section"}</Button></div><div className="grid gap-5 p-5 md:grid-cols-2"><Field label="Eyebrow" value={value.eyebrow ?? ""} readOnly={!editing} onChange={(next) => update("eyebrow", next)} /><Field label="Title" required value={value.title} readOnly={!editing} onChange={(next) => update("title", next)} /><div className="md:col-span-2"><Field label="Description" multiline value={value.description ?? ""} readOnly={!editing} onChange={(next) => update("description", next)} /></div></div>{editing ? <div className="flex justify-end gap-2 border-t border-[#d7e1dc] px-5 py-3"><Button type="button" variant="outline" onClick={() => { setValue(initial); setEditing(false); }} disabled={pending}>Cancel</Button><Button type="button" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button></div> : null}</section>;
}

function Field({ label, value, onChange, readOnly, multiline = false, required = false }: { label: string; value: string; onChange: (value: string) => void; readOnly: boolean; multiline?: boolean; required?: boolean }) { const className = "mt-2 w-full rounded-md border border-[#c5d4cd] bg-white px-3 py-2.5 text-sm text-[#163a37] outline-none focus:ring-2 focus:ring-[#1d8f7a] disabled:bg-[#f8fbf9]"; return <label className="block text-sm font-semibold text-[#315b55]">{label}{required ? " *" : null}{multiline ? <textarea className={`${className} min-h-28 resize-y`} value={value} disabled={readOnly} onChange={(event) => onChange(event.target.value)} /> : <input className={className} value={value} disabled={readOnly} onChange={(event) => onChange(event.target.value)} />}</label>; }
