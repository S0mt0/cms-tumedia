"use client";

import { Pencil, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { notifyActionResult } from "@/components/common/action-toast";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { updateLandingSection } from "@/lib/actions/landing.actions";
import type { LandingSectionKey } from "@/lib/constants/landing-sections";
import type { ActionResult } from "@/lib/types/content";
import type { LandingSections } from "@/lib/types/landing";

type EditableSection = Exclude<LandingSectionKey, "hero">;

type SectionEditorFrameProps<TKey extends EditableSection> = {
  section: TKey;
  initial: LandingSections[TKey];
  title: string;
  description: string;
  children: (props: {
    draft: LandingSections[TKey];
    updateDraft: (next: LandingSections[TKey]) => void;
    readOnly: boolean;
  }) => React.ReactNode;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function SectionEditorFrame<TKey extends EditableSection>({
  section,
  initial,
  title,
  description,
  children,
}: SectionEditorFrameProps<TKey>) {
  const [persisted, setPersisted] = useState(() => clone(initial));
  const [draft, setDraft] = useState(() => clone(initial));
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const isDirty = useMemo(
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
    if (!isDirty) return;

    startTransition(async () => {
      const next = await updateLandingSection({ section, data: draft });
      setResult(next);
      notifyActionResult(next);
      if (next.success) {
        setPersisted(clone(draft));
        setEditing(false);
      }
    });
  }

  return (
    <section
      className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]"
      data-automated-test-id={`landing-${section}-editor`}
    >
      <header className="flex flex-col gap-4 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-sm font-bold text-[#163a37]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#61746d]">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <Button
              disabled={pending}
              onClick={discard}
              type="button"
              variant="outline"
            >
              <RotateCcw aria-hidden /> Discard
            </Button>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              type="button"
              variant="outline"
            >
              <Pencil aria-hidden /> Edit section
            </Button>
          )}
          {editing ? (
            <Button disabled={pending || !isDirty} onClick={save} type="button">
              <Save aria-hidden /> {pending ? "Saving…" : "Save changes"}
            </Button>
          ) : null}
        </div>
      </header>
      <form
        className="p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        {children({ draft, updateDraft: setDraft, readOnly })}
        <div className="mt-6 flex flex-col gap-4 border-t border-[#d7e1dc] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[#61746d]">
            Edits remain local until you save. A successful save refreshes the
            public landing-page payload.
          </p>
          <Button disabled={pending || !isDirty} type="submit">
            <Save aria-hidden /> {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
        <FormFeedback result={result} />
      </form>
    </section>
  );
}
