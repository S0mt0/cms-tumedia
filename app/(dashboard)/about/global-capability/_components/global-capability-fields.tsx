"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { StructuredField } from "../../_components/structured-field";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";
import { createItemId, normaliseOrder } from "@/lib/utils";

type Capability = AboutSections["globalCapability"];
type Location = Capability["locations"][number];

export function GlobalCapabilityFields({
  value,
  readOnly,
  baseUrl,
  onChange,
}: {
  value: Capability;
  readOnly: boolean;
  baseUrl: string;
  onChange: (next: Capability) => void;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  function updateLocation(id: string, next: Location) {
    onChange({
      ...value,
      locations: value.locations.map((location) =>
        location.id === id ? next : location
      ),
    });
  }
  function addLocation() {
    if (value.locations.length >= 8) return;
    onChange({
      ...value,
      locations: [
        ...value.locations,
        {
          id: createItemId("location"),
          title: "",
          label: "",
          copy: "",
          image: { url: "", alt: "" },
          order: value.locations.length,
        },
      ],
    });
  }
  function removeLocation(id: string) {
    setConfirmingId(id);
  }

  return <><div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="about-capability-eyebrow"
          label="Eyebrow"
          readOnly={readOnly}
          value={value.eyebrow}
          onChange={(eyebrow) => onChange({ ...value, eyebrow })}
        />
        <Field
          id="about-capability-title"
          label="Title"
          readOnly={readOnly}
          value={value.title}
          onChange={(title) => onChange({ ...value, title })}
        />
      </div>
      <div>
        <Label htmlFor="about-capability-description">Description</Label>
        <Textarea
          className="mt-2 min-h-28"
          id="about-capability-description"
          readOnly={readOnly}
          value={value.description}
          onChange={(event) =>
            onChange({ ...value, description: event.target.value })
          }
        />
      </div>
      <Field
        id="about-capability-scroll-hint"
        label="Scroll hint"
        readOnly={readOnly}
        value={value.scrollHint}
        onChange={(scrollHint) => onChange({ ...value, scrollHint })}
      />
      <section className="border-t border-[#d7e1dc] pt-6">
        <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-[#163a37]">Locations</h3>
            <p className="mt-1 text-sm text-[#61746d]">
              Each location needs editorial copy and an image for the public
              sequence.
            </p>
          </div>
          <Button
            disabled={readOnly || value.locations.length >= 8}
            size="sm"
            type="button"
            variant="outline"
            onClick={addLocation}
          >
            <Plus /> Add location
          </Button>
        </div>
        <p className="mt-3 text-xs text-[#61746d]">
          {value.locations.length} of 8 locations · drag cards to set public
          order
        </p>
        <div className="mt-4 space-y-3">
          <SortableDndContainer
            disabled={readOnly}
            items={value.locations}
            sortableItems
            onReorder={(locations) =>
              onChange({ ...value, locations: normaliseOrder(locations) })
            }
          >
            {(location, index) => (
              <article className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
                <header className="flex items-center justify-between border-b border-[#d7e1dc] pb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      aria-hidden
                      className="size-4 cursor-grab text-[#78928a]"
                    />
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#47635b]">
                      Location {index + 1}
                    </p>
                  </div>
                  <Button
                    aria-label={`Remove location ${index + 1}`}
                    className="text-[#a55353]"
                    disabled={readOnly || value.locations.length === 1}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeLocation(location.id)}
                  >
                    <Trash2 />
                  </Button>
                </header>
                <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,.7fr)]">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        id={`about-capability-${location.id}-title`}
                        label="Title"
                        readOnly={readOnly}
                        value={location.title}
                        onChange={(title) =>
                          updateLocation(location.id, { ...location, title })
                        }
                      />
                      <Field
                        id={`about-capability-${location.id}-label`}
                        label="Label"
                        readOnly={readOnly}
                        value={location.label}
                        onChange={(label) =>
                          updateLocation(location.id, { ...location, label })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`about-capability-${location.id}-copy`}>
                        Copy
                      </Label>
                      <Textarea
                        className="mt-2 min-h-50"
                        id={`about-capability-${location.id}-copy`}
                        readOnly={readOnly}
                        value={location.copy}
                        onChange={(event) =>
                          updateLocation(location.id, {
                            ...location,
                            copy: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <StructuredField
                    baseUrl={baseUrl}
                    label="Location image"
                    readOnly={readOnly}
                    value={location.image}
                    onChange={(image) =>
                      updateLocation(location.id, {
                        ...location,
                        image: image as Location["image"],
                      })
                    }
                  />
                </div>
              </article>
            )}
          </SortableDndContainer>
        </div>
      </section>
    </div><AlertDialog open={confirmingId !== null} onOpenChange={(open) => { if (!open) setConfirmingId(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove location?</AlertDialogTitle><AlertDialogDescription>This location will be removed from the draft. Save changes to publish the removal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction type="button" variant="destructive" onClick={() => { if (confirmingId) onChange({ ...value, locations: normaliseOrder(value.locations.filter((location) => location.id !== confirmingId)) }); setConfirmingId(null); }}>Delete location</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
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
