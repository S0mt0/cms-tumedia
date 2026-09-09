"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StructuredSectionEditor } from "@/components/forms/structured-section-editor";
import { updateIndustriesSection } from "@/lib/actions/industries.actions";
import type { IndustriesSections } from "@/lib/types/industries";
const id = () => `industry-${crypto.randomUUID()}`;
export function IndustriesFields<T extends keyof IndustriesSections>({
  section,
  initial,
  title,
  description,
}: {
  section: T;
  initial: IndustriesSections[T];
  title: string;
  description: string;
}) {
  return (
    <StructuredSectionEditor
      initial={initial}
      title={title}
      description={description}
      saveAction={(data) => updateIndustriesSection({ section, data })}
    >
      {({ value, onChange, readOnly }) =>
        section === "hero" ? (
          <Hero
            value={value as IndustriesSections["hero"]}
            onChange={onChange as never}
            readOnly={readOnly}
          />
        ) : section === "introduction" ? (
          <Introduction
            value={value as IndustriesSections["introduction"]}
            onChange={onChange as never}
            readOnly={readOnly}
          />
        ) : (
          <Items
            value={value as IndustriesSections["items"]}
            onChange={onChange as never}
            readOnly={readOnly}
          />
        )
      }
    </StructuredSectionEditor>
  );
}
function Hero({
  value,
  onChange,
  readOnly,
}: {
  value: IndustriesSections["hero"];
  onChange: (v: IndustriesSections["hero"]) => void;
  readOnly: boolean;
}) {
  const u = (p: Partial<typeof value>) => onChange({ ...value, ...p });
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field
        label="Eyebrow"
        value={value.eyebrow ?? ""}
        disabled={readOnly}
        onChange={(eyebrow) => u({ eyebrow })}
      />
      <Field
        label="Title"
        value={value.title}
        disabled={readOnly}
        onChange={(title) => u({ title })}
      />
      <Field
        label="Emphasised words"
        value={value.emphasis ?? ""}
        disabled={readOnly}
        onChange={(emphasis) => u({ emphasis })}
      />
      <Field
        label="CTA label"
        value={value.ctaLabel ?? ""}
        disabled={readOnly}
        onChange={(ctaLabel) => u({ ctaLabel })}
      />
      <div className="md:col-span-2">
        <Field
          label="Description"
          textarea
          value={value.description ?? ""}
          disabled={readOnly}
          onChange={(description) => u({ description })}
        />
      </div>
    </div>
  );
}
function Introduction({
  value,
  onChange,
  readOnly,
}: {
  value: IndustriesSections["introduction"];
  onChange: (v: IndustriesSections["introduction"]) => void;
  readOnly: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field
        label="Title"
        value={value.title}
        disabled={readOnly}
        onChange={(title) => onChange({ ...value, title })}
      />
      <Field
        label="CTA label"
        value={value.cta.label}
        disabled={readOnly}
        onChange={(label) =>
          onChange({ ...value, cta: { ...value.cta, label } })
        }
      />
      <div className="md:col-span-2">
        <Field
          label="Description"
          textarea
          value={value.description}
          disabled={readOnly}
          onChange={(description) => onChange({ ...value, description })}
        />
        <Field
          label="CTA destination"
          value={value.cta.href}
          disabled={readOnly}
          onChange={(href) =>
            onChange({ ...value, cta: { ...value.cta, href } })
          }
        />
      </div>
    </div>
  );
}
function Items({
  value,
  onChange,
  readOnly,
}: {
  value: IndustriesSections["items"];
  onChange: (v: IndustriesSections["items"]) => void;
  readOnly: boolean;
}) {
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const update = (index: number, p: Partial<(typeof value)[number]>) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...p } : item)));
  const remove = (id: string) =>
    onChange(
      value
        .filter((item) => item.id !== id)
        .map((item, order) => ({ ...item, order }))
    );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Industry accordion</h3>
          <p className="text-sm text-[#61746d]">Add industry topics and their YouTube video reference.</p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={readOnly || value.length >= 12}
          onClick={() =>
            onChange([
              ...value,
              {
                id: id(),
                label: "",
                copy: "",
                videos: [],
                order: value.length,
              },
            ])
          }
        >
          <Plus />
          Add industry
        </Button>
      </div>
      {value.map((item, index) => (
        <section
          className="rounded-md border border-[#c5d4cd] p-4"
          key={item.id}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Label"
              value={item.label}
              disabled={readOnly}
              onChange={(label) => update(index, { label })}
            />
            <Field label="YouTube video URL" value={item.videos[0] ?? ""} disabled={readOnly} onChange={(url) => update(index, { videos: url.trim() ? [url] : [] })} />
            <div className="md:col-span-2">
              <Field
                label="Description"
                textarea
                value={item.copy}
                disabled={readOnly}
                onChange={(copy) => update(index, { copy })}
              />
            </div>
          </div>
          <Button
            className="mt-4 text-destructive"
            type="button"
            size="sm"
            variant="ghost"
            disabled={readOnly || value.length === 1}
            onClick={() => setPendingRemoval(item.id)}
          >
            <Trash2 />
            Remove
          </Button>
        </section>
      ))}
      <AlertDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this industry?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from the draft. Save changes to publish the update.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pendingRemoval) remove(pendingRemoval);
                setPendingRemoval(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  disabled,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-[#315b55]">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea
          className="mt-2 min-h-24"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          className="mt-2"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
