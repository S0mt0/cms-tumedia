"use client";

import { Pencil, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, useTransition, type ReactNode } from "react";

import type { AboutSections } from "@/lib/types/about";
import { notifyActionResult } from "@/components/common/action-toast";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { updateAboutSection } from "@/lib/actions/about.actions";
import { clone } from "@/lib/utils";
import { StructuredField } from "./structured-field";

type SectionKey = keyof AboutSections;
type FieldRenderer<TKey extends SectionKey> = (props: {
  value: AboutSections[TKey];
  readOnly: boolean;
  onChange: (next: AboutSections[TKey]) => void;
}) => ReactNode;

export function AboutSectionEditor<TKey extends SectionKey>({
  section,
  initial,
  title,
  description,
  mediaPreviewBaseUrl,
  renderFields,
}: {
  section: TKey;
  initial: AboutSections[TKey];
  title: string;
  description: string;
  mediaPreviewBaseUrl: string;
  renderFields?: FieldRenderer<TKey>;
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
        {renderFields ? (
          renderFields({
            value: draft,
            readOnly,
            onChange: setDraft,
          })
        ) : (
          <StructuredField
            baseUrl={mediaPreviewBaseUrl}
            label={section}
            readOnly={readOnly}
            value={draft}
            onChange={(next) => setDraft(next as AboutSections[TKey])}
          />
        )}
        {result ? <FormFeedback result={result} /> : null}
      </form>
    </section>
  );
}
