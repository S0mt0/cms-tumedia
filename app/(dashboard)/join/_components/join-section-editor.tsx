"use client";
import { Pencil, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { notifyActionResult } from "@/components/common/action-toast";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { updateJoinSection } from "@/lib/actions/join.actions";
import type { ActionResult } from "@/lib/types/content";
import type { JoinSections } from "@/lib/types/join";
import { clone } from "@/lib/utils";

export function JoinSectionEditor<TKey extends keyof JoinSections>({ section, initial, title, description, children }: { section: TKey; initial: JoinSections[TKey]; title: string; description: string; children: (props: { value: JoinSections[TKey]; readOnly: boolean; onChange: (next: JoinSections[TKey]) => void }) => ReactNode }) {
  const [persisted, setPersisted] = useState(() => clone(initial)); const [draft, setDraft] = useState(() => clone(initial)); const [editing, setEditing] = useState(false); const [result, setResult] = useState<ActionResult>(); const [pending, startTransition] = useTransition(); const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(persisted), [draft, persisted]); const readOnly = !editing || pending;
  const discard = () => { setDraft(clone(persisted)); setResult(undefined); setEditing(false); };
  const save = () => { if (!dirty) return; startTransition(async () => { const next = await updateJoinSection({ section, data: draft }); setResult(next); notifyActionResult(next); if (next.success) { setPersisted(clone(draft)); setEditing(false); } }); };
  return <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]"><header className="flex flex-col gap-3 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-bold text-[#163a37]">{title}</h2><p className="mt-1 text-sm text-[#61746d]">{description}</p></div><div className="flex gap-2">{editing ? <Button disabled={pending} type="button" variant="outline" onClick={discard}><RotateCcw /> Discard</Button> : <Button type="button" variant="outline" onClick={() => setEditing(true)}><Pencil /> Edit section</Button>}{editing ? <Button disabled={pending || !dirty} type="button" onClick={save}><Save /> {pending ? "Saving…" : "Save changes"}</Button> : null}</div></header><form className="space-y-6 p-5 sm:p-6" onSubmit={(event) => { event.preventDefault(); save(); }}>{children({ value: draft, readOnly, onChange: setDraft })}{result ? <FormFeedback result={result} /> : null}</form></section>;
}
