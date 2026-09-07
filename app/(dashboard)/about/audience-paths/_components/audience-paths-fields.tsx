"use client";

import { StructuredField } from "../../_components/structured-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSections } from "@/lib/types/about";

type AudiencePaths = AboutSections["audiencePaths"];
type Path = AudiencePaths["brand"] | AudiencePaths["creator"];

export function AudiencePathsFields({ value, readOnly, baseUrl, onChange }: { value: AudiencePaths; readOnly: boolean; baseUrl: string; onChange: (next: AudiencePaths) => void }) {
  return <div className="space-y-6"><div className="grid gap-5 md:grid-cols-2"><Field id="about-audience-eyebrow" label="Eyebrow" readOnly={readOnly} value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} /><Field id="about-audience-title" label="Title" readOnly={readOnly} value={value.title} onChange={(title) => onChange({ ...value, title })} /></div><div className="grid gap-5 xl:grid-cols-2"><PathPanel title="Brand path" prefix="brand" value={value.brand} readOnly={readOnly} onChange={(brand) => onChange({ ...value, brand })} /><PathPanel title="Creator path" prefix="creator" value={value.creator} readOnly={readOnly} onChange={(creator) => onChange({ ...value, creator })} media={<StructuredField baseUrl={baseUrl} label="Creator background" readOnly={readOnly} value={value.creator.background} onChange={(background) => onChange({ ...value, creator: { ...value.creator, background: background as AudiencePaths["creator"]["background"] } })} />} /></div></div>;
}

function PathPanel<TPath extends Path>({ title, prefix, value, readOnly, onChange, media }: { title: string; prefix: string; value: TPath; readOnly: boolean; onChange: (next: TPath) => void; media?: React.ReactNode }) {
  return <section className="rounded-sm border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5"><h3 className="text-base font-bold text-[#163a37]">{title}</h3><div className="mt-5 space-y-4"><div className="grid gap-4 md:grid-cols-2"><Field id={`about-audience-${prefix}-eyebrow`} label="Eyebrow" readOnly={readOnly} value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} /><Field id={`about-audience-${prefix}-title`} label="Title" readOnly={readOnly} value={value.title} onChange={(titleValue) => onChange({ ...value, title: titleValue })} /></div><div><Label htmlFor={`about-audience-${prefix}-copy`}>Copy</Label><Textarea className="mt-2 min-h-24" id={`about-audience-${prefix}-copy`} readOnly={readOnly} value={value.copy} onChange={(event) => onChange({ ...value, copy: event.target.value })} /></div><div><Label htmlFor={`about-audience-${prefix}-supporting-copy`}>Supporting copy</Label><Textarea className="mt-2 min-h-20" id={`about-audience-${prefix}-supporting-copy`} readOnly={readOnly} value={value.supportingCopy} onChange={(event) => onChange({ ...value, supportingCopy: event.target.value })} /></div><div className="grid gap-4 border-t border-[#d7e1dc] pt-4 md:grid-cols-2"><Field id={`about-audience-${prefix}-cta-label`} label="CTA label" readOnly={readOnly} value={value.cta.label} onChange={(label) => onChange({ ...value, cta: { ...value.cta, label } })} /><Field id={`about-audience-${prefix}-cta-href`} label="CTA destination" readOnly={readOnly} value={value.cta.href} onChange={(href) => onChange({ ...value, cta: { ...value.cta, href } })} /></div>{media ? <div className="border-t border-[#d7e1dc] pt-4">{media}</div> : null}</div></section>;
}

function Field({ id, label, readOnly, value, onChange }: { id: string; label: string; readOnly: boolean; value: string; onChange: (value: string) => void }) { return <div><Label htmlFor={id}>{label}</Label><Input className="mt-2" id={id} readOnly={readOnly} value={value} onChange={(event) => onChange(event.target.value)} /></div>; }
