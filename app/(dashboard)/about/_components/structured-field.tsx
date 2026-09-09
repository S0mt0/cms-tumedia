"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { MediaPreview } from "@/components/common/media-preview";
import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/types/content";
import type { HeroBackgroundMedia } from "@/lib/types/landing";
import { emptyFrom, humanize, isMedia, isRecord, normalise } from "@/lib/utils";

type FieldProps = {
  value: unknown;
  label: string;
  readOnly: boolean;
  baseUrl: string;
  onChange: (value: unknown) => void;
  depth?: number;
};

export function StructuredField({
  value,
  label,
  readOnly,
  baseUrl,
  onChange,
  depth = 0,
}: FieldProps) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
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
            <p className="mt-1 text-xs text-[#61746d]">
              {label === "paragraphs"
                ? "Edit the editorial paragraphs."
                : label === "collage"
                  ? "Upload the editorial images used in the hero collage."
                : "Add, edit, or remove items before saving."}
            </p>
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
          sortableItems={label !== "paragraphs" && label !== "collage"}
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
                  onClick={() => setPendingRemoval(item.id)}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
              {isMedia(item) ? (
                <StructuredField
                  baseUrl={baseUrl}
                  label="Image"
                  readOnly={readOnly}
                  value={item}
                  depth={depth + 1}
                  onChange={(next) =>
                    onChange(
                      items.map((current) =>
                        current.id === item.id
                          ? { ...current, ...(next as Record<string, unknown>) }
                          : current
                      )
                    )
                  }
                />
              ) : (
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
              )}
            </article>
          )}
        </SortableDndContainer>
        <AlertDialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Remove this item?</AlertDialogTitle><AlertDialogDescription>This removes it from the draft. Save changes to publish the update.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { if (pendingRemoval) onChange(normalise(items.filter((item) => item.id !== pendingRemoval))); setPendingRemoval(null); }}>Remove</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
        <div
          className={
            depth
              ? "grid gap-4 md:grid-cols-2"
              : label === "hero"
              ? "grid gap-5 lg:grid-cols-2"
              : "space-y-5"
          }
        >
          {Object.entries(value).map(([key, child]) => (
            <div
              key={key}
              className={
                label === "hero" &&
                [
                  "description",
                  "supportingCopy",
                  "background",
                  "collage",
                ].includes(key)
                  ? "lg:col-span-2"
                  : undefined
              }
            >
              <StructuredField
                baseUrl={baseUrl}
                label={key}
                readOnly={readOnly}
                value={child}
                depth={depth + 1}
                onChange={(next) => onChange({ ...value, [key]: next })}
              />
            </div>
          ))}
        </div>
      </section>
    );
  return null;
}
