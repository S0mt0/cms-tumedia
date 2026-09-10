"use client";

import { useState, useTransition } from "react";
import { ImagePlus } from "lucide-react";
import { notifyActionResult } from "@/components/common/action-toast";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaPreview } from "@/components/common/media-preview";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { updateSite } from "@/lib/actions/site.actions";
import type { ActionResult } from "@/lib/types/content";
import type { SiteContent } from "@/lib/types/site";
import { SiteOrganisationCard } from "./site-organisation-card";
import { SitePublishingAside } from "./site-publishing-aside";
import type { SiteDraft } from "./site-editor-types";

export function SiteEditor({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState<SiteDraft>({
    seo: initial.seo,
    branding: initial.branding,
    organisation: initial.organisation,
  });
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const [mediaTarget, setMediaTarget] = useState<"logo" | "favicon" | null>(
    null
  );
  const save = () =>
    startTransition(async () => {
      const next = await updateSite(draft);
      setResult(next);
      notifyActionResult(next);
    });
  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="space-y-5">
        <SiteOrganisationCard draft={draft} setDraft={setDraft} />
        <ModuleCard
          title="Brand assets"
          description="Logo and favicon are uploaded to R2; changes remain draft-only until you save."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(["logo", "favicon"] as const).map((asset) => (
              <section
                key={asset}
                className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]"
              >
                <div className="flex items-center justify-between border-b border-[#d7e1dc] px-3 py-2">
                  <p className="text-sm font-semibold capitalize">{asset}</p>
                  <Button
                    disabled={pending}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMediaTarget(asset)}
                  >
                    <ImagePlus /> Change
                  </Button>
                </div>
                <MediaPreview
                  media={
                    draft.branding[asset]
                      ? { type: "image", ...draft.branding[asset] }
                      : undefined
                  }
                  className="h-32"
                />
              </section>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard title="SEO description" description="The default search description used when a page does not provide its own.">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="site-seo-description">
            Description
            <Textarea id="site-seo-description" value={draft.seo.description} onChange={(event) => setDraft((current) => ({ ...current, seo: { ...current.seo, description: event.target.value } }))} className="mt-2 min-h-28" />
          </label>
        </ModuleCard>
      </div>
      {mediaTarget ? (
        <MediaUploadDialog
          allowedTypes={["image"]}
          open
          onOpenChange={(open) => !open && setMediaTarget(null)}
          title={`Site ${mediaTarget}`}
          description="Upload an image to use as this global brand asset."
          value={{
            type: "image",
            ...(draft.branding[mediaTarget] ?? {
              url: "",
              alt:
                mediaTarget === "logo" ? "TU Media logo" : "TU Media favicon",
            }),
          }}
          onSelect={async (media) => {
            if (media.type !== "image")
              return { success: false, message: "Choose an image." };
            setDraft((current) => ({
              ...current,
              branding: {
                ...current.branding,
                [mediaTarget]: { url: media.url, alt: media.alt },
              },
            }));
            return {
              success: true,
              message: "Asset selected. Save site settings to publish it.",
            };
          }}
        />
      ) : null}
      <SitePublishingAside pending={pending} result={result} />
    </form>
  );
}
