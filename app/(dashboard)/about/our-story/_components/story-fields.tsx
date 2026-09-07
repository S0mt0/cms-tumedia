"use client";

import dynamic from "next/dynamic";
import { GripVertical, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";

type Story = AboutSections["story"];
type Principle = Story["principles"][number];

function EditorLoadingState() {
  return <div aria-busy="true" aria-live="polite" className="grid min-h-56 place-items-center rounded-sm border border-dashed border-[#b8cec4] bg-[#f8fbf9] px-4 text-center" role="status"><div><LoaderCircle aria-hidden className="mx-auto size-5 animate-spin text-[#176d64]" /><p className="mt-3 text-sm font-semibold text-[#234640]">Preparing story editor…</p><p className="mt-1 text-xs text-[#61746d]">Your editorial copy will be ready in a moment.</p></div></div>;
}

const SectionTextEditor = dynamic(() => import("@/components/forms/section-text-editor").then((module) => module.SectionTextEditor), { ssr: false, loading: EditorLoadingState });

export function StoryFields({ value, readOnly, onChange }: { value: Story; readOnly: boolean; onChange: (next: Story) => void }) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  function updatePrinciple(id: string, next: Principle) { onChange({ ...value, principles: value.principles.map((item) => item.id === id ? next : item) }); }
  function addPrinciple() { if (value.principles.length >= 8) return; onChange({ ...value, principles: [...value.principles, { id: createItemId("principle"), title: "", copy: "", order: value.principles.length }] }); }
  function removePrinciple() { if (!confirmingId) return; onChange({ ...value, principles: normaliseOrder(value.principles.filter((item) => item.id !== confirmingId)) }); }

  return <div className="space-y-6">
    <div className="grid gap-5 md:grid-cols-2"><Field id="about-story-eyebrow" label="Eyebrow" readOnly={readOnly} value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} /><Field id="about-story-title" label="Title" readOnly={readOnly} value={value.title} onChange={(title) => onChange({ ...value, title })} /></div>
    <SectionTextEditor id="about-story-copy" label="Story copy" description="Use paragraphs to shape the story. Only the approved inline formatting is published." readOnly={readOnly} value={value.body} onChange={(body) => onChange({ ...value, body })} />
    <section className="border-t border-[#d7e1dc] pt-6"><div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-end sm:justify-between"><div><Label htmlFor="about-story-principles-eyebrow">Principles eyebrow</Label><Input className="mt-2 w-full sm:w-80" id="about-story-principles-eyebrow" readOnly={readOnly} value={value.principlesEyebrow} onChange={(event) => onChange({ ...value, principlesEyebrow: event.target.value })} /></div><Button disabled={readOnly || value.principles.length >= 8} size="sm" type="button" variant="outline" onClick={addPrinciple}><Plus /> Add principle</Button></div><p className="mt-3 text-xs text-[#61746d]">{value.principles.length} of 8 principles · drag cards to set public order</p><div className="mt-4 grid gap-3 xl:grid-cols-2"><SortableDndContainer disabled={readOnly} items={value.principles} sortableItems onReorder={(principles) => onChange({ ...value, principles: normaliseOrder(principles) })}>{(item, index) => <article className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4"><header className="flex items-center justify-between border-b border-[#d7e1dc] pb-3"><div className="flex items-center gap-2"><GripVertical aria-hidden className="size-4 cursor-grab text-[#78928a]" /><p className="text-xs font-bold uppercase tracking-[.12em] text-[#47635b]">Principle {index + 1}</p></div><Button aria-label={`Remove principle ${index + 1}`} className="text-[#a55353]" disabled={readOnly || value.principles.length === 1} size="icon-sm" type="button" variant="ghost" onClick={() => setConfirmingId(item.id)}><Trash2 /></Button></header><div className="mt-4"><Field id={`about-story-${item.id}-title`} label="Title" readOnly={readOnly} value={item.title} onChange={(title) => updatePrinciple(item.id, { ...item, title })} /><div className="mt-4"><Label htmlFor={`about-story-${item.id}-copy`}>Copy</Label><Textarea className="mt-2 min-h-24" id={`about-story-${item.id}-copy`} readOnly={readOnly} value={item.copy} onChange={(event) => updatePrinciple(item.id, { ...item, copy: event.target.value })} /></div></div></article>}</SortableDndContainer></div></section>
    <AlertDialog open={confirmingId !== null} onOpenChange={(open) => { if (!open) setConfirmingId(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove principle?</AlertDialogTitle><AlertDialogDescription>This principle will be removed from the draft. Save changes to publish the removal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction type="button" variant="destructive" onClick={() => { removePrinciple(); setConfirmingId(null); }}>Delete principle</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}

function Field({ id, label, readOnly, value, onChange }: { id: string; label: string; readOnly: boolean; value: string; onChange: (value: string) => void }) { return <div><Label htmlFor={id}>{label}</Label><Input className="mt-2" id={id} readOnly={readOnly} value={value} onChange={(event) => onChange(event.target.value)} /></div>; }
