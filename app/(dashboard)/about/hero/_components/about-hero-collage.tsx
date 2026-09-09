"use client";

import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { MediaPreview } from "@/components/common/media-preview";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types/content";
import type { HeroBackgroundMedia, MediaRef } from "@/lib/types/landing";
import { createItemId } from "@/lib/utils";

type CollageImage = MediaRef & { id: string; order: number };

type AboutHeroCollageProps = {
  baseUrl: string;
  value: CollageImage[];
  readOnly: boolean;
  onChange: (next: CollageImage[]) => void;
};

const MAX_COLLAGE_IMAGES = 3;
const emptyMedia: HeroBackgroundMedia = { type: "image", url: "", alt: "" };

export function AboutHeroCollage({
  baseUrl,
  value,
  readOnly,
  onChange,
}: AboutHeroCollageProps) {
  const [activeId, setActiveId] = useState<string | "new" | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const activeImage = useMemo(
    () => value.find((image) => image.id === activeId),
    [activeId, value]
  );
  const dialogOpen = activeId !== null;

  function removeImage(id: string) {
    onChange(value.filter((image) => image.id !== id).map((image, order) => ({ ...image, order })));
    setPendingRemoval(null);
  }

  async function selectImage(
    media: HeroBackgroundMedia
  ): Promise<ActionResult> {
    if (media.type !== "image") {
      return {
        success: false,
        message: "The hero collage only accepts images.",
      };
    }

    const nextImage: CollageImage = {
      id: activeImage?.id ?? createItemId("about-hero-collage"),
      order: activeImage?.order ?? value.length,
      url: media.url,
      alt: media.alt,
    };

    onChange(
      activeImage
        ? value.map((image) =>
            image.id === activeImage.id ? nextImage : image
          )
        : [...value, nextImage]
    );

    return {
      success: true,
      message: "Collage image selected. Save this section to publish it.",
    };
  }

  return (
    <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#163a37]">Hero collage</h3>
          <p className="mt-1 text-xs leading-5 text-[#61746d]">
            Add up to three editorial images. Their display order is fixed.
          </p>
        </div>
        <Button
          disabled={readOnly || value.length >= MAX_COLLAGE_IMAGES}
          onClick={() => setActiveId("new")}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden /> Add image
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {value.map((image, index) => (
          <article
            className="min-w-0 overflow-hidden rounded-sm border border-[#d5e0da] bg-white"
            key={image.id}
          >
            <MediaPreview
              baseUrl={baseUrl}
              className="aspect-square"
              compact
              media={{ type: "image", ...image }}
            />
            <div className="border-t border-[#e0e8e4] p-2">
              <p className="truncate text-xs font-semibold text-[#36544b]">
                Image {index + 1}
              </p>
              <div className="mt-2 flex gap-1.5">
                <Button
                  className="min-w-0 flex-1 px-2"
                  disabled={readOnly}
                  onClick={() => setActiveId(image.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Pencil aria-hidden className="size-3.5" />
                  <span className="sr-only sm:not-sr-only">Change</span>
                </Button>
                <Button
                  aria-label={`Delete collage image ${index + 1}`}
                  className="px-2 text-[#9a514c]"
                  disabled={readOnly}
              onClick={() => setPendingRemoval(image.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 aria-hidden className="size-3.5" />
                </Button>
              </div>
            </div>
          </article>
        ))}

        {value.length === 0 ? (
          <div className="col-span-3 grid min-h-32 place-items-center rounded-sm border border-dashed border-[#b7c8c0] bg-white px-4 text-center text-sm text-[#61746d]">
            <div>
              <ImagePlus className="mx-auto size-5" aria-hidden />
              <p className="mt-2">No collage images selected.</p>
            </div>
          </div>
        ) : null}
      </div>

      <MediaUploadDialog
        allowedTypes={["image"]}
        baseUrl={baseUrl}
        description="Upload an editorial image for the About hero collage."
        disabled={readOnly}
        key={activeId ?? "closed"}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
        onSelect={selectImage}
        open={dialogOpen}
        title={activeImage ? "Change collage image" : "Add collage image"}
        value={activeImage ? { type: "image", ...activeImage } : emptyMedia}
      />
      <AlertDialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remove this collage image?</AlertDialogTitle><AlertDialogDescription>This removes it from the draft. Save changes to publish the update.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => pendingRemoval && removeImage(pendingRemoval)}>Remove</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
