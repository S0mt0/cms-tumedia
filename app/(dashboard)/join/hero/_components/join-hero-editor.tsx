"use client";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { MediaPreview } from "@/components/common/media-preview";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { LabeledInput } from "@/components/forms/labeled-input";
import { Button } from "@/components/ui/button";
import { JoinCopyFields } from "../../_components/join-copy-fields";
import { JoinSectionEditor } from "../../_components/join-section-editor";
import type { ActionResult } from "@/lib/types/content";
import type { JoinMedia, JoinSections } from "@/lib/types/join";

export function JoinHeroEditor({
  initial,
  mediaPreviewBaseUrl,
}: {
  initial: JoinSections["hero"];
  mediaPreviewBaseUrl: string;
}) {
  return (
    <JoinSectionEditor
      section="hero"
      initial={initial}
      title="Hero content"
      description="Set the creator invitation and the media in its editorial frame."
    >
      {({ value, readOnly, onChange }) => (
        <HeroFields
          value={value}
          readOnly={readOnly}
          baseUrl={mediaPreviewBaseUrl}
          onChange={onChange}
        />
      )}
    </JoinSectionEditor>
  );
}

function HeroFields({
  value,
  readOnly,
  baseUrl,
  onChange,
}: {
  value: JoinSections["hero"];
  readOnly: boolean;
  baseUrl: string;
  onChange: (value: JoinSections["hero"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const update = (patch: Partial<JoinSections["hero"]>) =>
    onChange({ ...value, ...patch });
  const select = async (media: JoinMedia): Promise<ActionResult> => {
    update({ media });
    return {
      success: true,
      message: "Media selected. Save this section to publish it.",
    };
  };
  const selectPoster = async (media: JoinMedia): Promise<ActionResult> => {
    if (media.type !== "image") return { success: false, message: "Choose an image for the fallback poster." };
    if (value.media.type !== "video") return { success: false, message: "A fallback poster is only used with video." };
    update({ media: { ...value.media, posterUrl: media.url } });
    return { success: true, message: "Fallback image selected. Save this section to publish it." };
  };
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <JoinCopyFields
          idPrefix="join-hero"
          value={value}
          readOnly={readOnly}
          onChange={update}
          afterTitle={<LabeledInput id="join-hero-cta" label="CTA label" readOnly={readOnly} value={value.ctaLabel ?? ""} onChange={(ctaLabel) => update({ ctaLabel: ctaLabel || undefined })} />}
        />
      </div>
      <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]">
        <div className="flex items-center justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-[#163a37]">Hero media</h3>
            <p className="mt-1 text-xs text-[#61746d]">
              Choose a looping video or a static image. Video can include a
              fallback poster.
            </p>
          </div>
          <Button
            disabled={readOnly}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <ImagePlus /> Change
          </Button>
        </div>
        <MediaPreview baseUrl={baseUrl} className="h-72" media={value.media} />
        <div className="grid gap-4 border-t border-[#d7e1dc] p-4">
          <LabeledInput
            id="join-hero-media-alt"
            label="Alternative text"
            readOnly={readOnly}
            value={value.media.alt ?? ""}
            onChange={(alt) =>
              update({ media: { ...value.media, alt } as JoinMedia })
            }
          />
          {value.media.type === "video" ? (
            <div className="flex items-center justify-between rounded-sm border border-[#d7e1dc] bg-white p-3"><div><p className="text-sm font-medium text-[#163a37]">Fallback poster image</p><p className="mt-1 text-xs text-[#61746d]">{value.media.posterUrl ? "A poster is selected." : "Choose an image shown before video loads."}</p></div><Button disabled={readOnly} onClick={() => setPosterOpen(true)} size="sm" type="button" variant="outline"><ImagePlus /> {value.media.posterUrl ? "Change" : "Upload image"}</Button></div>
          ) : null}
        </div>
        <MediaUploadDialog
          allowedTypes={["image", "video"]}
          baseUrl={baseUrl}
          description="Upload media for the creator hero."
          disabled={readOnly}
          onOpenChange={setOpen}
          onSelect={select}
          open={open}
          title="Hero media"
          value={value.media}
        />
        <MediaUploadDialog allowedTypes={["image"]} baseUrl={baseUrl} description="Upload the image shown while the creator hero video loads." disabled={readOnly || value.media.type !== "video"} onOpenChange={setPosterOpen} onSelect={selectPoster} open={posterOpen} title="Fallback poster image" value={value.media.type === "video" && value.media.posterUrl ? { type: "image", url: value.media.posterUrl, alt: value.media.alt ?? "" } : { type: "image", url: "", alt: "" }} />
      </section>
    </div>
  );
}
