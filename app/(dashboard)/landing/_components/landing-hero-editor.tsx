"use client";

import { ImagePlus, Pencil, RotateCcw, Save } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { FormFeedback } from "@/components/forms/form-feedback";
import { MediaPreview } from "@/components/common/media-preview";
import { notifyActionResult } from "@/components/common/action-toast";
import { CtaButtonsEditor } from "@/components/forms/cta-buttons-editor";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateLandingSection } from "@/lib/actions/landing.actions";
import type { ActionResult } from "@/lib/types/content";
import type { LandingSections } from "@/lib/types/landing";

type LandingHeroEditorProps = {
  initial: LandingSections["hero"];
  mediaPreviewBaseUrl: string;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function LandingHeroEditor({ initial, mediaPreviewBaseUrl }: LandingHeroEditorProps) {
  const [persisted, setPersisted] = useState(() => clone(initial));
  const [draft, setDraft] = useState(() => clone(initial));
  const [editing, setEditing] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(persisted), [draft, persisted]);
  const readOnly = !editing || pending;

  function discard() {
    setDraft(clone(persisted));
    setResult(undefined);
    setEditing(false);
  }

  function save() {
    if (!isDirty) return;
    startTransition(async () => {
      const next = await updateLandingSection({ section: "hero", data: draft });
      setResult(next);
      notifyActionResult(next);
      if (next.success) {
        setPersisted(clone(draft));
        setEditing(false);
      }
    });
  }

  async function selectBackgroundMedia(
    backgroundMedia: LandingSections["hero"]["backgroundMedia"]
  ) {
    setDraft((current) => ({ ...current, backgroundMedia }));
    return {
      success: true,
      message: "Media selected. Save the hero section to publish it.",
    };
  }

  return (
    <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]" data-automated-test-id="landing-hero-editor">
      <header className="flex flex-col gap-4 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-sm font-bold text-[#163a37]">Hero content</h2>
          <p className="mt-1 text-sm leading-6 text-[#61746d]">The opening statement, calls to action, and background media.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {editing ? <Button disabled={pending} onClick={discard} type="button" variant="outline"><RotateCcw aria-hidden /> Discard</Button> : <Button onClick={() => setEditing(true)} type="button" variant="outline"><Pencil aria-hidden /> Edit section</Button>}
          {editing ? <Button disabled={pending || !isDirty} onClick={save} type="button"><Save aria-hidden /> {pending ? "Saving…" : "Save changes"}</Button> : null}
        </div>
      </header>

      <form className="p-5 sm:p-6" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(18rem,.62fr)]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="hero-eyebrow">Eyebrow</Label>
                <Input id="hero-eyebrow" className="mt-2" onChange={(event) => setDraft((current) => ({ ...current, eyebrow: event.target.value }))} readOnly={readOnly} value={draft.eyebrow} />
              </div>
              <div>
                <Label htmlFor="hero-title">Heading</Label>
                <Input id="hero-title" className="mt-2" onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} readOnly={readOnly} value={draft.title} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="hero-emphasis">Emphasised words</Label>
                <Input id="hero-emphasis" className="mt-2" onChange={(event) => setDraft((current) => ({ ...current, emphasis: event.target.value }))} readOnly={readOnly} value={draft.emphasis} />
              </div>
            </div>
            <div>
              <Label htmlFor="hero-description">Supporting copy</Label>
              <Textarea id="hero-description" className="mt-2 min-h-32" onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} readOnly={readOnly} value={draft.description} />
            </div>
            <CtaButtonsEditor onChange={(ctas) => setDraft((current) => ({ ...current, ctas }))} readOnly={readOnly} value={draft.ctas} />
          </div>

          <aside className="space-y-5 2xl:border-l 2xl:border-[#d7e1dc] 2xl:pl-6">
            <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]">
              <div className="flex items-center justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#163a37]">Background media</h3>
                  <p className="mt-1 text-xs text-[#61746d]">{draft.backgroundMedia.type === "image" ? "Image" : "Looping MP4 video"}</p>
                </div>
                <Button disabled={readOnly} onClick={() => setMediaDialogOpen(true)} size="sm" type="button" variant="outline"><ImagePlus aria-hidden /> Change</Button>
              </div>
              <MediaPreview baseUrl={mediaPreviewBaseUrl} media={draft.backgroundMedia} />
              <div className="px-4 py-3 text-xs leading-5 text-[#61746d]">{draft.backgroundMedia.type === "image" ? draft.backgroundMedia.alt : draft.backgroundMedia.alt || "No description added for this video."}</div>
            </section>
            <div>
              <Label htmlFor="hero-scroll-label">Scroll prompt</Label>
              <Input id="hero-scroll-label" className="mt-2" onChange={(event) => setDraft((current) => ({ ...current, scrollLabel: event.target.value }))} readOnly={readOnly} value={draft.scrollLabel} />
            </div>
            <p className="rounded-md border border-[#d4e0da] bg-[#eff7f3] px-4 py-3 text-sm leading-6 text-[#52736a]">Changes are saved only when this form differs from its latest published values.</p>
            <FormFeedback result={result} />
          </aside>
        </div>
      </form>
      <MediaUploadDialog baseUrl={mediaPreviewBaseUrl} disabled={readOnly} onOpenChange={setMediaDialogOpen} onSelect={selectBackgroundMedia} open={mediaDialogOpen} value={draft.backgroundMedia} />
    </section>
  );
}
