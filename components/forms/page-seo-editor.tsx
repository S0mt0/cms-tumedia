"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { MediaPreview } from "@/components/common/media-preview";
import { FormFeedback } from "@/components/forms/form-feedback";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notifyActionResult } from "@/components/common/action-toast";
import { updatePageSeo } from "@/lib/actions/seo.actions";
import type { ActionResult, SeoFields } from "@/lib/types/content";

type SeoPage = "landing" | "about" | "contact" | "join" | "blogs" | "industries" | "work" | "services" | "legal";

export function PageSeoEditor({ page, initial, mediaPreviewBaseUrl }: { page: SeoPage; initial: SeoFields; mediaPreviewBaseUrl?: string }) {
  const [draft, setDraft] = useState<SeoFields>(initial);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const update = (patch: Partial<SeoFields>) => setDraft((current) => ({ ...current, ...patch }));

  return <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); startTransition(async () => { const next = await updatePageSeo({ page, seo: draft }); setResult(next); notifyActionResult(next); }); }}>
    <section className="grid gap-5 rounded-md border border-[#c5d4cd] bg-[#fffdfa] p-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-5"><div><Label htmlFor={`${page}-seo-title`}>SEO title</Label><Input id={`${page}-seo-title`} className="mt-2" maxLength={160} value={draft.title ?? ""} onChange={(event) => update({ title: event.target.value || undefined })} placeholder="Optional browser and search title" /></div><div><Label htmlFor={`${page}-seo-description`}>SEO description</Label><Textarea id={`${page}-seo-description`} className="mt-2 min-h-28" maxLength={320} value={draft.description ?? ""} onChange={(event) => update({ description: event.target.value || undefined })} placeholder="Optional search-result description" /></div></div>
      <aside className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]"><div className="flex items-start justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3"><div><h2 className="font-bold text-[#163a37]">Open Graph image</h2><p className="mt-1 text-xs leading-5 text-[#61746d]">Optional image used when this page is shared.</p></div><Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => setMediaOpen(true)}><ImagePlus />{draft.ogImage ? "Change" : "Upload"}</Button></div><MediaPreview baseUrl={mediaPreviewBaseUrl} className="h-48" media={{ type: "image", url: draft.ogImage ?? "", alt: "Open Graph preview" }} />{draft.ogImage ? <div className="p-3"><Button className="w-full text-[#a55353]" type="button" variant="ghost" onClick={() => update({ ogImage: undefined })}><Trash2 /> Remove image</Button></div> : null}</aside>
    </section>
    <div className="flex flex-wrap items-center justify-end gap-3"><FormFeedback result={result} /><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save SEO settings"}</Button></div>
    <MediaUploadDialog allowedTypes={["image"]} baseUrl={mediaPreviewBaseUrl} description="Upload the image shown when this page is shared on social platforms." disabled={pending} onOpenChange={setMediaOpen} onSelect={async (media) => { if (media.type !== "image") return { success: false, message: "Choose an image." }; update({ ogImage: media.url }); return { success: true, message: "Image selected. Save SEO settings to publish it." }; }} open={mediaOpen} title="Open Graph image" value={{ type: "image", url: draft.ogImage ?? "", alt: "Open Graph preview" }} />
  </form>;
}
