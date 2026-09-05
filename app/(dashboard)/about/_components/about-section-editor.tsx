"use client";

import { ImagePlus, Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { notifyActionResult } from "@/components/common/action-toast";
import { MediaPreview } from "@/components/common/media-preview";
import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { FormFeedback } from "@/components/forms/form-feedback";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateAboutSection } from "@/lib/actions/about.actions";
import type { AboutSections } from "@/lib/types/about";
import type { ActionResult } from "@/lib/types/content";
import type { HeroBackgroundMedia, MediaRef } from "@/lib/types/landing";

type SectionKey = keyof AboutSections;
type RecordValue = Record<string, unknown>;
type OrderedItem = RecordValue & { id: string; order?: number };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
function humanize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}
function isRecord(value: unknown): value is RecordValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isMedia(value: unknown): value is MediaRef {
  return (
    isRecord(value) &&
    typeof value.url === "string" &&
    typeof value.alt === "string"
  );
}
function createId(label: string) {
  return `${label.toLowerCase().replace(/\s+/g, "-")}-${crypto.randomUUID()}`;
}
function normalise(items: OrderedItem[]) {
  return items.map((item, order) => ({
    ...item,
    ...(Object.hasOwn(item, "order") ? { order } : {}),
  }));
}
function emptyFrom(value: unknown, label: string): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key === "id"
        ? createId(label)
        : key === "order"
        ? 0
        : emptyFrom(child, label),
    ])
  );
}

type FieldProps = {
  value: unknown;
  label: string;
  readOnly: boolean;
  baseUrl: string;
  onChange: (value: unknown) => void;
  depth?: number;
};

function StructuredField({
  value,
  label,
  readOnly,
  baseUrl,
  onChange,
  depth = 0,
}: FieldProps) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  if (typeof value === "string") {
    const multiline =
      /text|copy|description|paragraph|statement|introduction|manifesto|supporting/i.test(
        label
      ) || value.length > 110;
    const id = `about-${label.replace(/\W+/g, "-").toLowerCase()}`;
    return (
      <div>
        <Label htmlFor={id}>{humanize(label)}</Label>
        {multiline ? (
          <Textarea
            id={id}
            className="mt-2 min-h-28"
            readOnly={readOnly}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <Input
            id={id}
            className="mt-2"
            readOnly={readOnly}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>
    );
  }
  if (isMedia(value)) {
    async function select(media: HeroBackgroundMedia): Promise<ActionResult> {
      if (media.type !== "image")
        return { success: false, message: "This field requires an image." };
      onChange({ url: media.url, alt: media.alt });
      return {
        success: true,
        message: "Image selected. Save this section to publish it.",
      };
    }
    return (
      <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]">
        <div className="flex items-center justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-[#163a37]">
              {humanize(label)}
            </h3>
            <p className="mt-1 text-xs text-[#61746d]">
              Image with required alternative text
            </p>
          </div>
          <Button
            disabled={readOnly}
            onClick={() => setMediaOpen(true)}
            size="sm"
            type="button"
            variant="outline"
          >
            <ImagePlus aria-hidden /> Change
          </Button>
        </div>
        <MediaPreview
          baseUrl={baseUrl}
          className="h-48"
          media={{ type: "image", ...value }}
        />
        <p className="border-t border-[#d7e1dc] px-4 py-3 text-xs text-[#61746d]">
          {value.alt}
        </p>
        <MediaUploadDialog
          allowedTypes={["image"]}
          baseUrl={baseUrl}
          description="Upload an image for this About section."
          disabled={readOnly}
          onOpenChange={setMediaOpen}
          onSelect={select}
          open={mediaOpen}
          title={humanize(label)}
          value={{ type: "image", ...value }}
        />
      </section>
    );
  }
  if (Array.isArray(value)) {
    const items = value.filter(
      (item): item is OrderedItem =>
        isRecord(item) && typeof item.id === "string"
    );
    const template = value[0];
    return (
      <section className="space-y-3 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#163a37]">
              {humanize(label)}
            </h3>
            <p className="mt-1 text-xs text-[#61746d]">{label === "paragraphs" ? "Edit the editorial paragraphs." : "Drag to set public order. Add, edit, or remove items before saving."}</p>
          </div>
          <Button
            disabled={readOnly}
            size="sm"
            type="button"
            variant="outline"
            onClick={() => setAdding(true)}
          >
            <Plus aria-hidden /> Add item
          </Button>
        </div>
        <SortableDndContainer
          disabled={readOnly}
          sortableItems={label !== "paragraphs"}
          items={items}
          onReorder={(next) => onChange(normalise(next))}
        >
          {(item, index) => (
            <article className="rounded-md border border-[#d5e0da] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-[#5b786e]">
                  {humanize(label)} {index + 1}
                </p>
                <Button
                  disabled={readOnly || items.length === 1}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  className="text-[#9a514c]"
                  onClick={() => {
                    if (window.confirm("Remove this item?"))
                      onChange(
                        normalise(
                          items.filter((current) => current.id !== item.id)
                        )
                      );
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(item)
                  .filter(([key]) => key !== "id" && key !== "order")
                  .map(([key, child]) => (
                    <StructuredField
                      key={key}
                      baseUrl={baseUrl}
                      label={key}
                      readOnly={readOnly}
                      value={child}
                      depth={depth + 1}
                      onChange={(next) =>
                        onChange(
                          items.map((current) =>
                            current.id === item.id
                              ? { ...current, [key]: next }
                              : current
                          )
                        )
                      }
                    />
                  ))}
              </div>
            </article>
          )}
        </SortableDndContainer>
        {adding ? (
          <div className="flex items-center justify-between rounded-md border border-dashed border-[#8caea1] bg-white p-3">
            <span className="text-sm text-[#527069]">
              Add a new {humanize(label).toLowerCase()} item?
            </span>
            <span className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAdding(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (template !== undefined)
                    onChange([
                      ...items,
                      {
                        ...(emptyFrom(template, label) as OrderedItem),
                        order: items.length,
                      },
                    ]);
                  setAdding(false);
                }}
              >
                Add item
              </Button>
            </span>
          </div>
        ) : null}
      </section>
    );
  }
  if (isRecord(value))
    return (
      <section
        className={
          depth
            ? "space-y-4 rounded-md border border-[#d5e0da] bg-[#f8fbf9] p-4"
            : "space-y-5"
        }
      >
        <h3 className={depth ? "text-sm font-bold text-[#163a37]" : "sr-only"}>
          {humanize(label)}
        </h3>
        <div className={depth ? "grid gap-4 md:grid-cols-2" : "space-y-5"}>
          {Object.entries(value).map(([key, child]) => (
            <StructuredField
              key={key}
              baseUrl={baseUrl}
              label={key}
              readOnly={readOnly}
              value={child}
              depth={depth + 1}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </section>
    );
  return null;
}

export function AboutSectionEditor<TKey extends SectionKey>({
  section,
  initial,
  title,
  description,
  mediaPreviewBaseUrl,
}: {
  section: TKey;
  initial: AboutSections[TKey];
  title: string;
  description: string;
  mediaPreviewBaseUrl: string;
}) {
  const [persisted, setPersisted] = useState(() => clone(initial));
  const [draft, setDraft] = useState(() => clone(initial));
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(persisted),
    [draft, persisted]
  );
  const readOnly = !editing || pending;
  function discard() {
    setDraft(clone(persisted));
    setResult(undefined);
    setEditing(false);
  }
  function save() {
    if (!dirty) return;
    startTransition(async () => {
      const next = await updateAboutSection({ section, data: draft });
      setResult(next);
      notifyActionResult(next);
      if (next.success) {
        setPersisted(clone(draft));
        setEditing(false);
      }
    });
  }
  return (
    <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]">
      <header className="flex flex-col gap-3 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#163a37]">{title}</h2>
          <p className="mt-1 text-sm text-[#61746d]">{description}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <Button
              disabled={pending}
              type="button"
              variant="outline"
              onClick={discard}
            >
              <RotateCcw /> Discard
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              <Pencil /> Edit section
            </Button>
          )}
          {editing ? (
            <Button disabled={pending || !dirty} type="button" onClick={save}>
              <Save /> {pending ? "Saving…" : "Save changes"}
            </Button>
          ) : null}
        </div>
      </header>
      <form
        className="space-y-5 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <StructuredField
          baseUrl={mediaPreviewBaseUrl}
          label={section}
          readOnly={readOnly}
          value={draft}
          onChange={(next) => setDraft(next as AboutSections[TKey])}
        />
        {result ? <FormFeedback result={result} /> : null}
      </form>
    </section>
  );
}
