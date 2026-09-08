"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ContactSectionEditor } from "../../_components/contact-section-editor";
import { ContactCopyFields } from "../../_components/contact-copy-fields";
import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContactSections } from "@/lib/types/contact";
import { createItemId, normaliseOrder } from "@/lib/utils";

export function ContactHeroEditor({ initial }: { initial: ContactSections["hero"] }) {
  return <ContactSectionEditor section="hero" initial={initial} title="Hero content" description="Edit the opening promise and concise focus points.">{({ value, readOnly, onChange }) => <HeroFields value={value} readOnly={readOnly} onChange={onChange} />}</ContactSectionEditor>;
}

function HeroFields({ value, readOnly, onChange }: { value: ContactSections["hero"]; readOnly: boolean; onChange: (next: ContactSections["hero"]) => void }) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const update = (patch: Partial<ContactSections["hero"]>) => onChange({ ...value, ...patch });
  return <div className="space-y-6"><ContactCopyFields idPrefix="contact-hero" {...value} readOnly={readOnly} onChange={update} /><section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5"><div className="flex items-start justify-between gap-4 border-b border-[#d7e1dc] pb-4"><div><h3 className="font-bold text-[#163a37]">Hero focus points</h3><p className="mt-1 text-sm text-[#61746d]">Short notes displayed beside the hero. Keep the list focused.</p></div><Button disabled={readOnly || value.notes.length >= 6} size="sm" type="button" variant="outline" onClick={() => update({ notes: [...value.notes, { id: createItemId("contact-note"), text: "", order: value.notes.length }] })}><Plus /> Add point</Button></div><div className="mt-4 space-y-2"><SortableDndContainer disabled={readOnly} items={value.notes} sortableItems onReorder={(notes) => update({ notes: normaliseOrder(notes) })}>{(note, index) => <div className="flex items-center gap-2 rounded-sm border border-[#d7e1dc] bg-white p-2"><GripVertical className="size-4 shrink-0 cursor-grab text-[#8ba098]" /><Input aria-label={`Focus point ${index + 1}`} className="h-9 border-transparent bg-transparent shadow-none focus-visible:border-[#77a899] focus-visible:ring-0" readOnly={readOnly} value={note.text} onChange={(event) => update({ notes: value.notes.map((item) => item.id === note.id ? { ...item, text: event.target.value } : item) })} /><Button aria-label={`Delete focus point ${index + 1}`} className="text-[#a55353]" disabled={readOnly} size="icon-sm" type="button" variant="ghost" onClick={() => setConfirming(note.id)}><Trash2 /></Button></div>}</SortableDndContainer></div></section><AlertDialog open={Boolean(confirming)} onOpenChange={(open) => !open && setConfirming(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove focus point?</AlertDialogTitle><AlertDialogDescription>This only changes the draft until you save the section.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { if (confirming) update({ notes: normaliseOrder(value.notes.filter((note) => note.id !== confirming)) }); setConfirming(null); }}>Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>;
}
