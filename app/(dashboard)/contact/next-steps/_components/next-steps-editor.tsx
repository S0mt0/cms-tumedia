"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { LabeledInput } from "@/components/forms/labeled-input";
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
import { Textarea } from "@/components/ui/textarea";
import { ContactSectionEditor } from "../../_components/contact-section-editor";
import { ContactCopyFields } from "../../_components/contact-copy-fields";
import type { ContactSections } from "@/lib/types/contact";
import { createItemId, normaliseOrder } from "@/lib/utils";

export function NextStepsEditor({
  initial,
}: {
  initial: ContactSections["nextSteps"];
}) {
  return (
    <ContactSectionEditor
      section="nextSteps"
      initial={initial}
      title="Next steps content"
      description="Explain the path after a visitor sends a brand enquiry."
    >
      {({ value, readOnly, onChange }) => (
        <NextStepFields value={value} readOnly={readOnly} onChange={onChange} />
      )}
    </ContactSectionEditor>
  );
}

function NextStepFields({
  value,
  readOnly,
  onChange,
}: {
  value: ContactSections["nextSteps"];
  readOnly: boolean;
  onChange: (next: ContactSections["nextSteps"]) => void;
}) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const update = (patch: Partial<ContactSections["nextSteps"]>) =>
    onChange({ ...value, ...patch });
  return (
    <div className="space-y-6">
      <ContactCopyFields
        idPrefix="contact-next-steps"
        {...value}
        readOnly={readOnly}
        onChange={update}
      />
      <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold text-[#163a37]">Steps</h3>
            <p className="mt-1 text-sm text-[#61746d]">
              Drag to define the public sequence.
            </p>
          </div>
          <Button
            disabled={readOnly || value.steps.length >= 8}
            size="sm"
            type="button"
            variant="outline"
            onClick={() =>
              update({
                steps: [
                  ...value.steps,
                  {
                    id: createItemId("contact-step"),
                    title: "",
                    copy: "",
                    order: value.steps.length,
                  },
                ],
              })
            }
          >
            <Plus /> Add step
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          <SortableDndContainer
            className="grid gap-3 lg:grid-cols-2"
            disabled={readOnly}
            items={value.steps}
            layout="grid"
            sortableItems
            onReorder={(steps) => update({ steps: normaliseOrder(steps) })}
          >
            {(step, index) => (
              <article className="rounded-sm border border-[#d7e1dc] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#47635b]">
                    <GripVertical className="size-4 cursor-grab" /> Step{" "}
                    {index + 1}
                  </span>
                  <Button
                    aria-label={`Delete step ${index + 1}`}
                    className="text-[#a55353]"
                    disabled={readOnly || value.steps.length === 1}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirming(step.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="max-w-3xl space-y-4">
                  <LabeledInput
                    id={`contact-step-${step.id}-title`}
                    label="Title"
                    readOnly={readOnly}
                    value={step.title}
                    onChange={(title) =>
                      update({
                        steps: value.steps.map((item) =>
                          item.id === step.id ? { ...item, title } : item
                        ),
                      })
                    }
                  />
                  <div>
                    <label
                      className="text-sm font-medium"
                      htmlFor={`contact-step-${step.id}-copy`}
                    >
                      Copy
                    </label>
                    <Textarea
                      id={`contact-step-${step.id}-copy`}
                      className="mt-2 min-h-24"
                      readOnly={readOnly}
                      value={step.copy}
                      onChange={(event) =>
                        update({
                          steps: value.steps.map((item) =>
                            item.id === step.id
                              ? { ...item, copy: event.target.value }
                              : item
                          ),
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            )}
          </SortableDndContainer>
        </div>
      </section>
      <AlertDialog
        open={Boolean(confirming)}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove step?</AlertDialogTitle>
            <AlertDialogDescription>
              This only changes the draft until you save the section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirming)
                  update({
                    steps: normaliseOrder(
                      value.steps.filter((step) => step.id !== confirming)
                    ),
                  });
                setConfirming(null);
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
