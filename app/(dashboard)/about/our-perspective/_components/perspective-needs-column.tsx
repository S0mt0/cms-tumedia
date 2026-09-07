"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AboutItem } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";

const MAX_ITEMS = 10;

export function PerspectiveNeedsColumn({
  side,
  eyebrow,
  title,
  items,
  readOnly,
  eyebrowId,
  titleId,
  onEyebrowChange,
  onTitleChange,
  onItemsChange,
}: {
  side: "Brands" | "Creators";
  eyebrow: string;
  title: string;
  items: AboutItem[];
  readOnly: boolean;
  eyebrowId: string;
  titleId: string;
  onEyebrowChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onItemsChange: (items: AboutItem[]) => void;
}) {
  const prefix = side.toLowerCase();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function addItem() {
    if (items.length >= MAX_ITEMS) return;
    onItemsChange([
      ...items,
      { id: createItemId(`${prefix}-need`), text: "", order: items.length },
    ]);
  }

  function updateItem(id: string, text: string) {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, text } : item))
    );
  }

  function removeItem(id: string) {
    setConfirmingId(id);
  }

  return <><section className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#163a37]">{side}</h3>
          <p className="mt-1 text-xs text-[#61746d]">
            {items.length} of {MAX_ITEMS} needs
          </p>
        </div>
        <Button
          disabled={readOnly || items.length >= MAX_ITEMS}
          size="sm"
          type="button"
          variant="outline"
          onClick={addItem}
        >
          <Plus /> Add need
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={eyebrowId}>Eyebrow</Label>
          <Input
            className="mt-2"
            id={eyebrowId}
            readOnly={readOnly}
            value={eyebrow}
            onChange={(event) => onEyebrowChange(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={titleId}>Title</Label>
          <Input
            className="mt-2"
            id={titleId}
            readOnly={readOnly}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label>Partnership needs</Label>
        <SortableDndContainer
          disabled={readOnly}
          items={items}
          sortableItems
          onReorder={(next) => onItemsChange(normaliseOrder(next))}
        >
          {(item, index) => (
            <div className="group flex items-center gap-2 rounded-sm border border-[#d7e1dc] bg-white p-2">
              <GripVertical
                aria-hidden
                className="size-4 shrink-0 text-[#8ba098] group-data-[disabled=true]:opacity-50 cursor-grab"
              />
              <Input
                aria-label={`${side} need ${index + 1}`}
                className="h-9 border-transparent bg-transparent px-2 shadow-none focus-visible:border-[#77a899] focus-visible:ring-0"
                readOnly={readOnly}
                value={item.text}
                onChange={(event) => updateItem(item.id, event.target.value)}
              />
              <Button
                aria-label={`Remove ${side.toLowerCase()} need ${index + 1}`}
                className="shrink-0 text-[#a55353] hover:text-[#7e3636]"
                disabled={readOnly || items.length === 1}
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </SortableDndContainer>
      </div>
    </section><AlertDialog open={confirmingId !== null} onOpenChange={(open) => { if (!open) setConfirmingId(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove {side.toLowerCase()} need?</AlertDialogTitle><AlertDialogDescription>This need will be removed from the draft. Save changes to publish the removal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction type="button" variant="destructive" onClick={() => { if (confirmingId) onItemsChange(normaliseOrder(items.filter((item) => item.id !== confirmingId))); setConfirmingId(null); }}>Delete need</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
}
