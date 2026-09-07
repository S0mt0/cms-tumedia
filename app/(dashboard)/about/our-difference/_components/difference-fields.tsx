"use client";

import { Plus } from "lucide-react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";
import { DifferenceCard } from "./difference-card";

type Difference = AboutSections["difference"];
type DifferenceItem = Difference["items"][number];

const MAX_DIFFERENTIATORS = 8;

export function DifferenceFields({
  value,
  readOnly,
  onChange,
}: {
  value: Difference;
  readOnly: boolean;
  onChange: (next: Difference) => void;
}) {
  function updateItem(id: string, nextItem: DifferenceItem) {
    onChange({
      ...value,
      items: value.items.map((item) => (item.id === id ? nextItem : item)),
    });
  }

  function removeItem(id: string) {
    if (!window.confirm("Remove this differentiator?")) return;
    onChange({
      ...value,
      items: normaliseOrder(value.items.filter((item) => item.id !== id)),
    });
  }

  function addItem() {
    if (value.items.length >= MAX_DIFFERENTIATORS) return;
    onChange({
      ...value,
      items: [
        ...value.items,
        {
          id: createItemId("difference"),
          title: "",
          short: "",
          copy: "",
          details: [
            { id: createItemId("difference-detail"), text: "", order: 0 },
          ],
          order: value.items.length,
        },
      ],
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          id="about-difference-eyebrow"
          label="Eyebrow"
          readOnly={readOnly}
          value={value.eyebrow}
          onChange={(eyebrow) => onChange({ ...value, eyebrow })}
        />
        <TextInput
          id="about-difference-title"
          label="Title"
          readOnly={readOnly}
          value={value.title}
          onChange={(title) => onChange({ ...value, title })}
        />
      </div>

      <div>
        <Label htmlFor="about-difference-introduction">Introduction</Label>
        <Textarea
          className="mt-2 min-h-28"
          id="about-difference-introduction"
          readOnly={readOnly}
          value={value.introduction}
          onChange={(event) =>
            onChange({ ...value, introduction: event.target.value })
          }
        />
      </div>

      <section className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#47635b]">
          Call to action
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <TextInput
            id="about-difference-cta-label"
            label="Button label"
            readOnly={readOnly}
            value={value.cta.label}
            onChange={(label) =>
              onChange({ ...value, cta: { ...value.cta, label } })
            }
          />
          <TextInput
            id="about-difference-cta-href"
            label="Destination"
            readOnly={readOnly}
            value={value.cta.href}
            onChange={(href) =>
              onChange({ ...value, cta: { ...value.cta, href } })
            }
          />
        </div>
      </section>

      <section className="border-t border-[#d7e1dc] pt-6">
        <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-[#163a37]">
              Differentiators
            </h3>
            <p className="mt-1 text-sm text-[#61746d]">
              Drag cards to set their public order. Each card can have up to 8
              detail points.
            </p>
          </div>
          <Button
            disabled={readOnly || value.items.length >= MAX_DIFFERENTIATORS}
            size="sm"
            type="button"
            variant="outline"
            onClick={addItem}
          >
            <Plus /> Add differentiator
          </Button>
        </div>
        <p className="mt-3 text-xs text-[#61746d]">
          {value.items.length} of {MAX_DIFFERENTIATORS} differentiators
        </p>
        <div className="mt-4 space-y-3">
          <SortableDndContainer
            disabled={readOnly}
            items={value.items}
            sortableItems
            onReorder={(items) =>
              onChange({ ...value, items: normaliseOrder(items) })
            }
          >
            {(item, index) => (
              <DifferenceCard
                canRemove={value.items.length > 1}
                index={index}
                item={item}
                readOnly={readOnly}
                onChange={(nextItem) => updateItem(item.id, nextItem)}
                onRemove={() => removeItem(item.id)}
              />
            )}
          </SortableDndContainer>
        </div>
      </section>
    </div>
  );
}

function TextInput({
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
