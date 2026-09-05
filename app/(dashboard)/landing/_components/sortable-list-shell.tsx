"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Plus, Trash2, X } from "lucide-react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { Button } from "@/components/ui/button";

export type OrderedItem = { id: string; order: number };

export function normaliseOrder<TItem extends OrderedItem>(items: TItem[]) {
  return items.map((item, order) => ({ ...item, order }));
}

export function createItemId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function SortableItem({
  children,
  disabled,
  id,
  index,
  onRemove,
  title,
}: {
  children: React.ReactNode;
  disabled: boolean;
  id: string;
  index: number;
  onRemove: () => void;
  title: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });

  return (
    <section
      className="rounded-md border border-[#cbd9d3] bg-white"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#e0e8e4] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            aria-label={`Reorder ${title} ${index + 1}`}
            className="cursor-grab text-[#61746d] active:cursor-grabbing"
            disabled={disabled}
            size="icon-sm"
            type="button"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" aria-hidden />
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#58736b]">
            {title} {index + 1}
          </p>
        </div>
        <Button
          aria-label={`Remove ${title} ${index + 1}`}
          className="text-[#9a514c] hover:bg-[#fff0ee] hover:text-[#7d3833]"
          disabled={disabled}
          onClick={onRemove}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

export function SortableList<TItem extends OrderedItem>({
  children,
  disabled,
  items,
  onReorder,
}: {
  children: (item: TItem, index: number) => React.ReactNode;
  disabled: boolean;
  items: TItem[];
  onReorder: (items: TItem[]) => void;
}) {
  return (
    <SortableDndContainer disabled={disabled} items={items} onReorder={onReorder}>
      {children}
    </SortableDndContainer>
  );
}

export function ListSectionHeader({
  addLabel,
  description,
  disabled,
  onAdd,
  title,
}: {
  addLabel: string;
  description: string;
  disabled: boolean;
  onAdd: () => void;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-sm font-bold text-[#163a37]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#61746d]">{description}</p>
      </div>
      <Button disabled={disabled} onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus aria-hidden /> {addLabel}
      </Button>
    </div>
  );
}

export function InlineAddPanel({
  children,
  onAdd,
  onCancel,
  title,
}: {
  children: React.ReactNode;
  onAdd: () => void;
  onCancel: () => void;
  title: string;
}) {
  return (
    <section className="rounded-md border border-dashed border-[#8caea1] bg-[#f3f8f5] p-4">
      <p className="text-sm font-bold text-[#163a37]">Add {title}</p>
      <div className="mt-3">{children}</div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button onClick={onCancel} size="sm" type="button" variant="outline"><X aria-hidden /> Cancel</Button>
        <Button onClick={onAdd} size="sm" type="button"><Plus aria-hidden /> Add {title}</Button>
      </div>
    </section>
  );
}
