"use client";
import type { ReactNode } from "react";
import { LabeledInput } from "@/components/forms/labeled-input";
import { Textarea } from "@/components/ui/textarea";

type Copy = { eyebrow?: string; title: string; emphasis?: string; description?: string };
export function JoinCopyFields({ idPrefix, value, readOnly, onChange, descriptionLabel = "Description", afterTitle }: { idPrefix: string; value: Copy; readOnly: boolean; onChange: (patch: Partial<Copy>) => void; descriptionLabel?: string; afterTitle?: ReactNode }) {
  return <div className="space-y-5"><div className="grid gap-5 md:grid-cols-2"><LabeledInput id={`${idPrefix}-eyebrow`} label="Eyebrow" readOnly={readOnly} value={value.eyebrow ?? ""} onChange={(eyebrow) => onChange({ eyebrow: eyebrow || undefined })} /><LabeledInput id={`${idPrefix}-title`} label="Title" readOnly={readOnly} value={value.title} onChange={(title) => onChange({ title })} /><LabeledInput id={`${idPrefix}-emphasis`} label="Emphasised words" readOnly={readOnly} value={value.emphasis ?? ""} onChange={(emphasis) => onChange({ emphasis: emphasis || undefined })} />{afterTitle}</div><div><label className="text-sm font-medium" htmlFor={`${idPrefix}-description`}>{descriptionLabel}</label><Textarea className="mt-2 min-h-28" id={`${idPrefix}-description`} readOnly={readOnly} value={value.description ?? ""} onChange={(event) => onChange({ description: event.target.value || undefined })} /></div></div>;
}
