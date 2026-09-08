import { LabeledInput } from "@/components/forms/labeled-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactCopyFields({
  idPrefix,
  eyebrow,
  title,
  emphasis,
  description,
  readOnly,
  onChange,
}: {
  idPrefix: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  description?: string;
  readOnly: boolean;
  onChange: (patch: { eyebrow?: string; title?: string; emphasis?: string; description?: string }) => void;
}) {
  return <><div className="grid gap-5 md:grid-cols-2"><LabeledInput id={`${idPrefix}-eyebrow`} label="Eyebrow" readOnly={readOnly} value={eyebrow ?? ""} onChange={(eyebrow) => onChange({ eyebrow: eyebrow || undefined })} /><LabeledInput id={`${idPrefix}-title`} label="Title" readOnly={readOnly} value={title} onChange={(title) => onChange({ title })} /><LabeledInput id={`${idPrefix}-emphasis`} label="Emphasised words" readOnly={readOnly} value={emphasis ?? ""} onChange={(emphasis) => onChange({ emphasis: emphasis || undefined })} /></div><div><Label htmlFor={`${idPrefix}-description`}>Description</Label><Textarea id={`${idPrefix}-description`} className="mt-2 min-h-28" readOnly={readOnly} value={description ?? ""} onChange={(event) => onChange({ description: event.target.value || undefined })} /></div></>;
}
