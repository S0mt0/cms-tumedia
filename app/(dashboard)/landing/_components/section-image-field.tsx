"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";

import { MediaPreview } from "@/components/common/media-preview";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types/content";
import type { HeroBackgroundMedia, MediaRef } from "@/lib/types/landing";

export function SectionImageField({
  baseUrl,
  label = "Section image",
  value,
  onChange,
  readOnly,
}: {
  baseUrl: string;
  label?: string;
  value: MediaRef;
  onChange: (value: MediaRef) => void;
  readOnly: boolean;
}) {
  const [open, setOpen] = useState(false);

  async function select(media: HeroBackgroundMedia): Promise<ActionResult> {
    if (media.type !== "image") {
      return { success: false, message: "This section needs an image." };
    }
    onChange({ url: media.url, alt: media.alt });
    return { success: true, message: "Image selected. Save the section to publish it." };
  }

  return (
    <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]">
      <div className="flex items-center justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-[#163a37]">{label}</h3>
          <p className="mt-1 text-xs text-[#61746d]">Image with required alternative text</p>
        </div>
        <Button disabled={readOnly} onClick={() => setOpen(true)} size="sm" type="button" variant="outline">
          <ImagePlus aria-hidden /> Change
        </Button>
      </div>
      <MediaPreview baseUrl={baseUrl} className="h-52" media={{ type: "image", ...value }} />
      <p className="border-t border-[#d7e1dc] px-4 py-3 text-xs leading-5 text-[#61746d]">{value.alt}</p>
      <MediaUploadDialog
        allowedTypes={["image"]}
        baseUrl={baseUrl}
        description="Upload or choose the image used by this landing-page section."
        disabled={readOnly}
        onOpenChange={setOpen}
        onSelect={select}
        open={open}
        title={label}
        value={{ type: "image", ...value }}
      />
    </section>
  );
}
