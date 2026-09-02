"use client";

import axios from "axios";
import { Dialog } from "@base-ui/react/dialog";
import { FileImage, FileVideo, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useId, useState, useTransition } from "react";

import {
  createMediaAsset,
  createMediaUploadTarget,
} from "@/lib/actions/media.actions";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "@/components/common/media-preview";
import { notifyAsyncResult } from "@/components/common/action-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  VIDEO_MIME_TYPES,
  validateMediaFile,
} from "@/lib/media/file-validation";
import type { HeroBackgroundMedia } from "@/lib/types/landing";
import type { ActionResult } from "@/lib/types/content";

type MediaKind = "image" | "video";

type MediaUploadDialogProps = {
  baseUrl?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: HeroBackgroundMedia;
  onSelect: (value: HeroBackgroundMedia) => Promise<ActionResult>;
  disabled?: boolean;
};

export function MediaUploadDialog({
  baseUrl,
  open,
  onOpenChange,
  value,
  onSelect,
  disabled = false,
}: MediaUploadDialogProps) {
  const inputId = useId();
  const [kind, setKind] = useState<MediaKind>(value.type);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState(value.alt ?? "");
  const [error, setError] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState<number>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function chooseKind(nextKind: MediaKind) {
    setKind(nextKind);
    setFile(null);
    setPreviewUrl(null);
    setError(undefined);
    setUploadProgress(undefined);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setKind(value.type);
      setFile(null);
      setPreviewUrl(null);
      setAlt(value.alt ?? "");
      setError(undefined);
      setUploadProgress(undefined);
    }
    onOpenChange(nextOpen);
  }

  function onFileChange(nextFile: File | undefined) {
    if (!nextFile) return;
    const validation = validateMediaFile({ mimeType: nextFile.type, size: nextFile.size });
    if (!validation.valid) { setError(validation.message); return; }
    const nextKind = validation.kind;
    if (nextKind !== kind) {
      setError(`Choose a ${kind === "image" ? "supported image" : "MP4 video"}.`);
      return;
    }
    setError(undefined);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  }

  function upload() {
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (kind === "image" && !alt.trim()) {
      setError("Describe the image before uploading it.");
      return;
    }

    startTransition(async () => {
      setError(undefined);
      setUploadProgress(0);
      const target = await createMediaUploadTarget({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        folder: "pages",
      });
      if (!target.data) {
        notifyAsyncResult(target);
        setError(target.error ?? "We could not prepare that upload.");
        return;
      }

      try {
        await axios.put(target.data.uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (event) => {
            if (!event.total) return;
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          },
        });
      } catch {
        notifyAsyncResult({ error: "The upload did not finish. Please check your connection and try again." });
        setUploadProgress(undefined);
        setError("The upload did not finish. Please check your connection and try again.");
        return;
      }

      const saved = await createMediaAsset({
        key: target.data.key,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        folder: "pages",
        kind,
        alt: alt.trim() || undefined,
      });
      if (!saved.data) {
        notifyAsyncResult(saved);
        setError(saved.error ?? "The file uploaded, but could not be saved.");
        return;
      }

      const selectionResult = await onSelect(
        kind === "image"
          ? { type: "image", url: saved.data.url, alt: alt.trim() }
          : { type: "video", url: saved.data.url, alt: alt.trim() || undefined }
      );
      if (!selectionResult.success) {
        setError(selectionResult.message);
        return;
      }
      setUploadProgress(undefined);
      onOpenChange(false);
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#102420]/45 backdrop-blur-[2px]" />
        <Dialog.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-6">
          <Dialog.Popup className="w-full max-w-2xl rounded-md border border-[#9fb6ac] bg-[#fffdfa] text-[#163a37] outline-none">
            <div className="flex items-start justify-between gap-4 border-b border-[#d7e1dc] px-5 py-4 sm:px-6">
              <div>
                <Dialog.Title className="text-base font-bold">Background media</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm leading-6 text-[#61746d]">
                  Select an image or a looping MP4 video for the landing hero.
                </Dialog.Description>
              </div>
              <Dialog.Close render={<Button variant="ghost" size="icon" aria-label="Close media dialog" />}>
                <X className="size-5" aria-hidden />
              </Dialog.Close>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Background type">
                {([
                  ["image", "Image", FileImage, "A crisp still background."],
                  ["video", "Video", FileVideo, "A looping MP4 background."],
                ] as const).map(([option, label, Icon, description]) => (
                  <Button
                    aria-checked={kind === option}
                    className={`h-auto min-h-24 w-full items-start border p-4 text-left text-[#163a37] ${kind === option ? "border-[#176d64] bg-[#e8f3ef] hover:bg-[#e8f3ef]" : "border-[#c5d4cd] bg-white hover:border-[#83a69b] hover:bg-white"}`}
                    key={option}
                    onClick={() => chooseKind(option)}
                    role="radio"
                    type="button"
                    variant="outline"
                  >
                    <Icon className="size-5 text-[#176d64]" aria-hidden />
                    <span className="mt-2 block text-sm font-bold">{label}</span>
                    <span className="mt-1 block text-xs text-[#61746d]">{description}</span>
                  </Button>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_13rem]">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={inputId}>Choose {kind === "image" ? "image" : "MP4 video"}</Label>
                    <Input
                      accept={kind === "image" ? IMAGE_MIME_TYPES.join(",") : VIDEO_MIME_TYPES.join(",")}
                      className="mt-2 h-auto cursor-pointer py-2"
                      disabled={disabled || pending}
                      id={inputId}
                      onChange={(event) => onFileChange(event.target.files?.[0])}
                      type="file"
                    />
                    <p className="mt-2 text-xs leading-5 text-[#61746d]">Images: JPG, PNG, WebP, or AVIF up to {MAX_IMAGE_FILE_SIZE / (1024 * 1024)} MB. Video: MP4 up to {MAX_VIDEO_FILE_SIZE / (1024 * 1024)} MB.</p>
                  </div>
                  <div>
                    <Label htmlFor={`${inputId}-alt`}>
                      Alternative text {kind === "image" ? "(required)" : "(optional)"}
                    </Label>
                    <Input
                      className="mt-2"
                      disabled={disabled || pending}
                      id={`${inputId}-alt`}
                      onChange={(event) => setAlt(event.target.value)}
                      placeholder={kind === "image" ? "Describe what is visible in the image" : "Describe the video for internal context"}
                      value={alt}
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-md">
                  <MediaPreview baseUrl={baseUrl} className="h-48" emptyLabel="Your selected media will preview here." media={previewUrl ? { type: kind, url: previewUrl, alt } : kind === value.type ? { ...value, alt } : undefined} />
                </div>
              </div>

              {pending && uploadProgress !== undefined ? <div aria-live="polite"><div className="flex items-center justify-between text-xs font-semibold text-[#52736a]"><span>Uploading directly to R2</span><span>{uploadProgress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dce9e3]"><div className="h-full bg-[#176d64] transition-[width] duration-200" style={{ width: `${uploadProgress}%` }} /></div></div> : null}
              {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-[#d7e1dc] px-5 py-4 sm:px-6">
              <Dialog.Close render={<Button type="button" variant="outline" disabled={pending} />}>Cancel</Dialog.Close>
              <Button type="button" disabled={pending || disabled || !file} onClick={upload}>
                {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
                {pending ? "Uploading…" : "Upload and use"}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
