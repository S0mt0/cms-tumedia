"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";

type DifferenceItem = AboutSections["difference"]["items"][number];

const MAX_DETAILS = 8;

export function DifferenceCard({
  item,
  index,
  readOnly,
  canRemove,
  onChange,
  onRemove,
}: {
  item: DifferenceItem;
  index: number;
  readOnly: boolean;
  canRemove: boolean;
  onChange: (next: DifferenceItem) => void;
  onRemove: () => void;
}) {
  function addDetail() {
    if (item.details.length >= MAX_DETAILS) return;
    onChange({
      ...item,
      details: [
        ...item.details,
        {
          id: createItemId("difference-detail"),
          text: "",
          order: item.details.length,
        },
      ],
    });
  }

  function updateDetail(id: string, text: string) {
    onChange({
      ...item,
      details: item.details.map((detail) =>
        detail.id === id ? { ...detail, text } : detail
      ),
    });
  }

  function removeDetail(id: string) {
    if (!window.confirm("Remove this detail point?")) return;
    onChange({
      ...item,
      details: normaliseOrder(
        item.details.filter((detail) => detail.id !== id)
      ),
    });
  }

  return (
    <article className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <header className="flex items-center justify-between gap-4 border-b border-[#d7e1dc] pb-3">
        <div className="flex items-center gap-2">
          <GripVertical
            aria-hidden
            className="size-4 cursor-grab text-[#78928a]"
          />
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#47635b]">
            Differentiator {index + 1}
          </p>
        </div>
        <Button
          aria-label={`Remove differentiator ${index + 1}`}
          className="text-[#a55353] hover:text-[#7e3636]"
          disabled={readOnly || !canRemove}
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field
          id={`about-difference-${item.id}-title`}
          label="Title"
          readOnly={readOnly}
          value={item.title}
          onChange={(title) => onChange({ ...item, title })}
        />
        <Field
          id={`about-difference-${item.id}-short`}
          label="Short statement"
          readOnly={readOnly}
          value={item.short}
          onChange={(short) => onChange({ ...item, short })}
        />
      </div>

      <div className="mt-4">
        <Label htmlFor={`about-difference-${item.id}-copy`}>
          Supporting copy
        </Label>
        <Textarea
          className="mt-2 min-h-24"
          id={`about-difference-${item.id}-copy`}
          readOnly={readOnly}
          value={item.copy}
          onChange={(event) => onChange({ ...item, copy: event.target.value })}
        />
      </div>

      <div className="mt-4 border-t border-[#d7e1dc] pt-4">
        <div className="flex items-center justify-between gap-3">
          <Label>Detail points</Label>
          <Button
            disabled={readOnly || item.details.length >= MAX_DETAILS}
            size="sm"
            type="button"
            variant="outline"
            onClick={addDetail}
          >
            <Plus /> Add detail
          </Button>
        </div>
        <p className="mt-1 text-xs text-[#61746d]">
          {item.details.length} of {MAX_DETAILS} detail points
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <SortableDndContainer
            disabled={readOnly}
            items={item.details}
            onReorder={(details) =>
              onChange({ ...item, details: normaliseOrder(details) })
            }
            sortableItems
          >
            {(detail, detailIndex) => (
              <div className="flex items-center gap-2 rounded-sm border border-[#d7e1dc] bg-white p-2">
                <GripVertical
                  aria-hidden
                  className="size-3.5 shrink-0 cursor-grab text-[#8ba098]"
                />
                <Input
                  aria-label={`Detail point ${detailIndex + 1}`}
                  className="h-9 border-transparent bg-transparent px-2 shadow-none focus-visible:border-[#77a899] focus-visible:ring-0"
                  readOnly={readOnly}
                  value={detail.text}
                  onChange={(event) =>
                    updateDetail(detail.id, event.target.value)
                  }
                />
                <Button
                  aria-label={`Remove detail point ${detailIndex + 1}`}
                  className="shrink-0 text-[#a55353] hover:text-[#7e3636]"
                  disabled={readOnly || item.details.length === 1}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  onClick={() => removeDetail(detail.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </SortableDndContainer>
        </div>
      </div>
    </article>
  );
}

function Field({
  id,
  label,
  readOnly,
  value,
  onChange,
}: {
  id: string;
  label: string;
  readOnly: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        className="mt-2"
        id={id}
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
