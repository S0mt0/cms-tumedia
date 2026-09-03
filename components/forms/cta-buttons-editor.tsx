"use client";

import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeroCta } from "@/lib/types/landing";

type CtaButtonsEditorProps = {
  value: HeroCta[];
  onChange: (value: HeroCta[]) => void;
  readOnly: boolean;
};

function ordered(items: HeroCta[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

type SortableActionProps = {
  cta: HeroCta;
  index: number;
  count: number;
  readOnly: boolean;
  onMove: (index: number, direction: -1 | 1) => void;
  onUpdate: (id: string, changes: Partial<HeroCta>) => void;
  onSetVariant: (id: string, variant: HeroCta["variant"]) => void;
};

function SortableAction({
  cta,
  index,
  count,
  readOnly,
  onMove,
  onUpdate,
  onSetVariant,
}: SortableActionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cta.id, disabled: readOnly });

  return (
    <section
      className="rounded-md border border-[#d4e0da] bg-[#fffdfa] p-4"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.65 : 1,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#58736b]">
          <Button
            aria-label={`Drag ${cta.label || "action"} to change its order`}
            className="cursor-grab text-[#58736b] active:cursor-grabbing"
            disabled={readOnly}
            ref={setActivatorNodeRef}
            size="icon-xs"
            type="button"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" aria-hidden />
          </Button>
          Action {index + 1}
        </p>
        <div className="flex items-center gap-1">
          <Button
            aria-label={`Move ${cta.label || "action"} earlier`}
            disabled={readOnly || index === 0}
            onClick={() => onMove(index, -1)}
            size="icon-xs"
            type="button"
            variant="outline"
          >
            <ArrowUp aria-hidden />
          </Button>
          <Button
            aria-label={`Move ${cta.label || "action"} later`}
            disabled={readOnly || index === count - 1}
            onClick={() => onMove(index, 1)}
            size="icon-xs"
            type="button"
            variant="outline"
          >
            <ArrowDown aria-hidden />
          </Button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${cta.id}-label`}>Button label</Label>
          <Input
            id={`${cta.id}-label`}
            className="mt-2"
            onChange={(event) =>
              onUpdate(cta.id, { label: event.target.value })
            }
            readOnly={readOnly}
            value={cta.label}
          />
        </div>
        <div>
          <Label htmlFor={`${cta.id}-href`}>Destination</Label>
          <Input
            id={`${cta.id}-href`}
            className="mt-2"
            onChange={(event) => onUpdate(cta.id, { href: event.target.value })}
            readOnly={readOnly}
            value={cta.href}
          />
        </div>
        <div>
          <span className="block text-sm font-semibold text-[#274a45] leading-none">
            Style
          </span>
          <div
            className="mt-2 grid h-10 grid-cols-2 rounded-md border border-[#b7c8c0] bg-white p-1"
            role="radiogroup"
            aria-label={`${cta.label || "Action"} style`}
          >
            {(["primary", "secondary"] as const).map((variant) => (
              <Button
                aria-checked={cta.variant === variant}
                className="h-full px-2 text-xs capitalize"
                disabled={readOnly}
                key={variant}
                onClick={() => onSetVariant(cta.id, variant)}
                role="radio"
                type="button"
                variant={cta.variant === variant ? "default" : "ghost"}
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaButtonsEditor({
  value,
  onChange,
  readOnly,
}: CtaButtonsEditorProps) {
  const items = ordered(value);

  function update(id: string, changes: Partial<HeroCta>) {
    onChange(
      value.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next.map((item, order) => ({ ...item, order })));
  }

  function setVariant(id: string, variant: HeroCta["variant"]) {
    onChange(
      value.map((item) => {
        if (item.id === id) return { ...item, variant };
        return item.variant === variant
          ? {
              ...item,
              variant: variant === "primary" ? "secondary" : "primary",
            }
          : item;
      })
    );
  }

  return (
    <fieldset className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <legend className="text-sm font-bold text-[#163a37]">
            Calls to action
          </legend>
          <p className="mt-1 text-sm leading-6 text-[#61746d]">
            Set the visual style and order used in the hero.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#638178]">
          {items.length} actions
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <SortableDndContainer
          disabled={readOnly}
          items={items}
          onReorder={(nextItems) =>
            onChange(nextItems.map((item, order) => ({ ...item, order })))
          }
        >
          {(cta, index) => (
            <SortableAction
              cta={cta}
              count={items.length}
              index={index}
              onMove={move}
              onSetVariant={setVariant}
              onUpdate={update}
              readOnly={readOnly}
            />
          )}
        </SortableDndContainer>
      </div>
    </fieldset>
  );
}
