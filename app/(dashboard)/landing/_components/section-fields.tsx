"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CtaContent } from "@/lib/types/landing";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  multiline?: boolean;
  className?: string;
};

export function SectionTextField({
  id,
  label,
  value,
  onChange,
  readOnly,
  multiline = false,
  className,
}: TextFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          className="mt-2 min-h-28 bg-white"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          value={value}
        />
      ) : (
        <Input
          className="mt-2"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          value={value}
        />
      )}
    </div>
  );
}

export function SectionCtaFields({
  id,
  label = "Call to action",
  value,
  onChange,
  readOnly,
}: {
  id: string;
  label?: string;
  value: CtaContent;
  onChange: (value: CtaContent) => void;
  readOnly: boolean;
}) {
  return (
    <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
      <h3 className="text-sm font-bold text-[#163a37]">{label}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SectionTextField
          id={`${id}-label`}
          label="Label"
          onChange={(next) => onChange({ ...value, label: next })}
          readOnly={readOnly}
          value={value.label}
        />
        <SectionTextField
          id={`${id}-destination`}
          label="Destination"
          onChange={(next) => onChange({ ...value, href: next })}
          readOnly={readOnly}
          value={value.href}
        />
      </div>
    </section>
  );
}
