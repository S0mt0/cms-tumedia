"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LabeledInput({ id, label, readOnly = false, value, onChange }: { id: string; label: string; readOnly?: boolean; value: string; onChange: (value: string) => void }) {
  return <div><Label htmlFor={id}>{label}</Label><Input className="mt-2" id={id} readOnly={readOnly} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}
