"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AboutItem } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";

export function SortableTextList({
  title,
  description,
  itemLabel,
  addLabel,
  idPrefix,
  items,
  max,
  readOnly,
  multiline = false,
  onChange,
}: {
  title: string;
  description: string;
  itemLabel: string;
  addLabel: string;
  idPrefix: string;
  items: AboutItem[];
  max: number;
  readOnly: boolean;
  multiline?: boolean;
  onChange: (items: AboutItem[]) => void;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  function addItem() {
    if (items.length >= max) return;
    onChange([...items, { id: createItemId(idPrefix), text: "", order: items.length }]);
  }

  function removeItem(id: string) {
    setConfirmingId(id);
  }

  return <><section className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
    <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div><h3 className="text-base font-bold text-[#163a37]">{title}</h3><p className="mt-1 text-sm text-[#61746d]">{description}</p></div>
      <Button disabled={readOnly || items.length >= max} size="sm" type="button" variant="outline" onClick={addItem}><Plus /> {addLabel}</Button>
    </div>
    <p className="mt-3 text-xs text-[#61746d]">{items.length} of {max} items · drag to set public order</p>
    <div className="mt-4 space-y-2">
      <SortableDndContainer disabled={readOnly} items={items} sortableItems onReorder={(next) => onChange(normaliseOrder(next))}>
        {(item, index) => <div className="flex items-start gap-2 rounded-sm border border-[#d7e1dc] bg-white p-2">
          <GripVertical aria-hidden className="mt-2 size-4 shrink-0 cursor-grab text-[#8ba098]" />
          <div className="min-w-0 flex-1">
            {multiline ? <Textarea aria-label={`${itemLabel} ${index + 1}`} className="min-h-20 border-transparent bg-transparent px-2 shadow-none focus-visible:border-[#77a899] focus-visible:ring-0" readOnly={readOnly} value={item.text} onChange={(event) => onChange(items.map((current) => current.id === item.id ? { ...current, text: event.target.value } : current))} /> : <Input aria-label={`${itemLabel} ${index + 1}`} className="h-9 border-transparent bg-transparent px-2 shadow-none focus-visible:border-[#77a899] focus-visible:ring-0" readOnly={readOnly} value={item.text} onChange={(event) => onChange(items.map((current) => current.id === item.id ? { ...current, text: event.target.value } : current))} />}
          </div>
          <Button aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`} className="mt-0.5 shrink-0 text-[#a55353] hover:text-[#7e3636]" disabled={readOnly || items.length === 1} size="icon-sm" type="button" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 /></Button>
        </div>}
      </SortableDndContainer>
    </div>
  </section><AlertDialog open={confirmingId !== null} onOpenChange={(open) => { if (!open) setConfirmingId(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove {itemLabel.toLowerCase()}?</AlertDialogTitle><AlertDialogDescription>This item will be removed from the draft. Save changes to publish the removal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction type="button" variant="destructive" onClick={() => { if (confirmingId) onChange(normaliseOrder(items.filter((item) => item.id !== confirmingId))); setConfirmingId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
}
