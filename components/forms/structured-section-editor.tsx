"use client";
import { Pencil, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { notifyActionResult } from "@/components/common/action-toast";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types/content";
import { clone } from "@/lib/utils";

export function StructuredSectionEditor<T>({ initial, title, description, saveAction, children }: { initial: T; title: string; description: string; saveAction: (data: T) => Promise<ActionResult>; children: (props: { value: T; onChange: (value: T) => void; readOnly: boolean }) => ReactNode }) {
  const [saved, setSaved] = useState(() => clone(initial)); const [draft, setDraft] = useState(() => clone(initial)); const [editing, setEditing] = useState(false); const [pending, start] = useTransition(); const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const submit = () => start(async () => { const result = await saveAction(draft); notifyActionResult(result); if (result.success) { setSaved(clone(draft)); setEditing(false); } });
  return <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]"><header className="flex flex-col gap-3 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-bold text-[#163a37]">{title}</h2><p className="mt-1 text-sm text-[#61746d]">{description}</p></div><div className="flex gap-2">{editing ? <><Button type="button" variant="outline" disabled={pending} onClick={() => { setDraft(clone(saved)); setEditing(false); }}><RotateCcw/>Discard</Button><Button type="button" disabled={!dirty || pending} onClick={submit}><Save/>{pending?"Saving…":"Save changes"}</Button></> : <Button type="button" variant="outline" onClick={() => setEditing(true)}><Pencil/>Edit section</Button>}</div></header><div className="space-y-5 p-5 sm:p-6">{children({ value: draft, onChange: setDraft, readOnly: !editing || pending })}</div></section>;
}
