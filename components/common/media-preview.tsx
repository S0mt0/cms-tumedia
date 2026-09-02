"use client";

import { FileWarning, ImagePlus, Video } from "lucide-react";
import { useState } from "react";

type PreviewMedia = {
  type?: "image" | "video";
  url?: string;
  alt?: string;
};

type MediaPreviewProps = {
  media?: PreviewMedia;
  className?: string;
  emptyLabel?: string;
  baseUrl?: string;
};

function resolvePreviewUrl(url: string | undefined, baseUrl: string | undefined) {
  if (!url || !url.startsWith("/") || !baseUrl) return url;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function MediaPreviewContent({ media, className, emptyLabel, baseUrl }: MediaPreviewProps) {
  const source = resolvePreviewUrl(media?.url, baseUrl);
  const [status, setStatus] = useState<"empty" | "loading" | "ready" | "broken">(
    source ? "loading" : "empty"
  );
  const isVideo = media?.type === "video";

  const placeholder = (
    <div className={`grid place-items-center border border-dashed border-[#b7c8c0] bg-[#f4f7f5] px-4 text-center text-[#6b8179] ${className ?? "aspect-[16/10]"}`} data-media-state={status}>
      <div>
        {status === "broken" ? <FileWarning className="mx-auto size-8" aria-hidden /> : isVideo ? <Video className="mx-auto size-8" aria-hidden /> : <ImagePlus className="mx-auto size-8" aria-hidden />}
        <p className="mt-3 text-sm font-medium">{status === "broken" ? "Media preview unavailable" : status === "loading" ? "Loading preview…" : emptyLabel ?? (isVideo ? "No video selected" : "No image selected")}</p>
      </div>
    </div>
  );

  if (!source || status === "empty" || status === "broken") return placeholder;

  if (isVideo) {
    return <div className="relative">{status === "loading" ? placeholder : null}<video className={`${status === "loading" ? "absolute inset-0 h-px w-px opacity-0" : `block w-full object-cover ${className ?? "aspect-[16/10]"}`}`} controls muted onError={() => setStatus("broken")} onLoadedData={() => setStatus("ready")} src={source} /></div>;
  }

  return <div className="relative">{status === "loading" ? placeholder : null}
    {/* eslint-disable-next-line @next/next/no-img-element -- this dynamic CMS preview is kept hidden until loaded to avoid a broken-image flash. */}
    <img alt="" className={status === "loading" ? "absolute inset-0 h-px w-px opacity-0" : `block w-full object-cover ${className ?? "aspect-[16/10]"}`} onError={() => setStatus("broken")} onLoad={() => setStatus("ready")} src={source} />
  </div>;
}

export function MediaPreview(props: MediaPreviewProps) {
  return <MediaPreviewContent {...props} key={`${props.media?.type ?? "image"}:${props.media?.url ?? "empty"}:${props.baseUrl ?? ""}`} />;
}
