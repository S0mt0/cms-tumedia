"use client";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { StructuredSectionEditor } from "@/components/forms/structured-section-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateServicesSection } from "@/lib/actions/services.actions";
import type { ServicesSections } from "@/lib/types/services";

type ListItem = Record<string, unknown> & { id: string; order: number };

export function ServicesFields<T extends keyof ServicesSections>({ section, initial, title, description }: { section: T; initial: ServicesSections[T]; title: string; description: string }) {
  return <StructuredSectionEditor initial={initial} title={title} description={description} saveAction={(data) => updateServicesSection({ section, data })}>{({ value, onChange, readOnly }) => <SectionFields section={section} value={value as ServicesSections[keyof ServicesSections]} onChange={onChange as never} readOnly={readOnly} />}</StructuredSectionEditor>;
}

function SectionFields({ section, value, onChange, readOnly }: { section: keyof ServicesSections; value: ServicesSections[keyof ServicesSections]; onChange: (value: never) => void; readOnly: boolean }) {
  const data = value as Record<string, unknown>;
  const update = (key: string, next: unknown) => onChange({ ...data, [key]: next } as never);
  const listKey = ({ overview: "items", system: "needs", deepDives: "items", process: "steps", faq: "items" } as Record<string, string>)[section];
  const fields = section === "hero" ? ["eyebrow", "title", "emphasis", "exploreLabel", "contactLabel", "description"] : section === "overview" ? ["title", "description"] : section === "system" ? ["eyebrow", "title", "description"] : section === "process" || section === "industries" ? ["title", "description"] : section === "faq" ? ["eyebrow", "title"] : section === "closing" ? ["title", "primaryLabel", "secondaryLabel", "description"] : [];
  return <div className="space-y-6"><CopyFields fields={fields} fullWidthTitle={["overview", "process", "industries"].includes(section)} value={data} update={update} readOnly={readOnly} />{listKey ? <OrderedList label={section === "faq" ? "Questions" : section === "process" ? "Steps" : section === "deepDives" ? "Service deep dives" : "Items"} items={(data[listKey] as ListItem[]) ?? []} faq={section === "faq"} readOnly={readOnly} onChange={(items) => update(listKey, items)} /> : null}</div>;
}

function CopyFields({ fields, fullWidthTitle, value, update, readOnly }: { fields: string[]; fullWidthTitle: boolean; value: Record<string, unknown>; update: (key: string, next: string) => void; readOnly: boolean }) {
  return <div className="grid gap-5 md:grid-cols-2">{fields.map((field) => <label className={field === "description" || (field === "title" && fullWidthTitle) ? "md:col-span-2" : ""} key={field}><Label>{field.replace(/([A-Z])/g, " $1")}</Label>{field === "description" ? <Textarea className="mt-2 min-h-28" disabled={readOnly} value={String(value[field] ?? "")} onChange={(event) => update(field, event.target.value)} /> : <Input className="mt-2" disabled={readOnly} value={String(value[field] ?? "")} onChange={(event) => update(field, event.target.value)} />}</label>)}</div>;
}

function OrderedList({ label, items, faq, readOnly, onChange }: { label: string; items: ListItem[]; faq: boolean; readOnly: boolean; onChange: (items: ListItem[]) => void }) {
  const reorder = (next: ListItem[]) => onChange(next.map((item, order) => ({ ...item, order })));
  const change = (index: number, key: string, next: string) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  const add = () => onChange([...items, { id: `service-${crypto.randomUUID()}`, order: items.length, ...(faq ? { question: "", answer: "" } : { title: "", tagline: "", copy: "" }) }]);
  return <section className="rounded-lg border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-bold text-[#163a37]">{label}</h3><p className="mt-1 text-sm text-[#61746d]">Drag items to control their public order.</p></div><Button type="button" size="sm" variant="outline" disabled={readOnly} onClick={add}>Add item</Button></div><SortableDndContainer className="grid gap-4 lg:grid-cols-2" disabled={readOnly} items={items} onReorder={reorder} sortableItems>{(item, index) => <details className="rounded-md border bg-white p-4" open={!faq}><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[#173c38]"><span>{faq ? String(item.question || "Untitled question") : `${label} ${index + 1}`}</span>{faq ? <span aria-hidden>+</span> : null}</summary><div className="mt-4 space-y-3">{Object.entries(item).filter(([key]) => !["id", "order", "details"].includes(key)).map(([key, entry]) => <label className="block" key={key}><Label>{key.replace(/([A-Z])/g, " $1")}</Label>{["copy", "answer"].includes(key) ? <Textarea className="mt-2 min-h-24" disabled={readOnly} value={String(entry ?? "")} onChange={(event) => change(index, key, event.target.value)} /> : <Input className="mt-2" disabled={readOnly} value={String(entry ?? "")} onChange={(event) => change(index, key, event.target.value)} />}</label>)}<Button type="button" variant="ghost" size="sm" className="text-destructive" disabled={readOnly || items.length === 1} onClick={() => reorder(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></div></details>}</SortableDndContainer></section>;
}
