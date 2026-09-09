"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { StructuredSectionEditor } from "@/components/forms/structured-section-editor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateWorkSection } from "@/lib/actions/work.actions";
import type { WorkSections } from "@/lib/types/work";

type ListItem = { id: string; title?: string; question?: string; copy?: string; answer?: string; videos?: string[]; order: number };

export function WorkFields<T extends keyof WorkSections>({ section, initial, title, description }: { section: T; initial: WorkSections[T]; title: string; description: string }) {
  return <StructuredSectionEditor initial={initial} title={title} description={description} saveAction={(data) => updateWorkSection({ section, data })}>{({ value, onChange, readOnly }) => <WorkSectionFields section={section} value={value as WorkSections[keyof WorkSections]} onChange={onChange as never} readOnly={readOnly} />}</StructuredSectionEditor>;
}

function WorkSectionFields({ section, value, onChange, readOnly }: { section: keyof WorkSections; value: WorkSections[keyof WorkSections]; onChange: (value: never) => void; readOnly: boolean }) {
  const data = value as Record<string, unknown>;
  const update = (key: string, next: unknown) => onChange({ ...data, [key]: next } as never);
  if (section === "hero") return <CopyFields fields={["eyebrow", "title", "emphasis", "ctaLabel", "aside", "description"]} value={data} onChange={update} readOnly={readOnly} />;
  if (section === "invitation") return <CopyFields fields={["eyebrow", "title", "description"]} value={data} onChange={update} readOnly={readOnly} />;
  if (section === "collection") return <CollectionFields value={data as WorkSections["collection"]} onChange={(next) => onChange(next as never)} readOnly={readOnly} />;
  if (section === "process") return <ProcessFields value={data as WorkSections["process"]} onChange={(next) => onChange(next as never)} readOnly={readOnly} />;
  return <FaqFields value={data as WorkSections["faq"]} onChange={(next) => onChange(next as never)} readOnly={readOnly} />;
}

function CopyFields({ fields, value, onChange, readOnly }: { fields: string[]; value: Record<string, unknown>; onChange: (key: string, value: string) => void; readOnly: boolean }) {
  return <div className="grid gap-5 md:grid-cols-2">{fields.map((field) => <label className={field === "description" || field === "aside" ? "md:col-span-2" : ""} key={field}><Label>{field.replace(/([A-Z])/g, " $1")}</Label>{field === "description" || field === "aside" ? <Textarea className="mt-2" disabled={readOnly} value={(value[field] as string) ?? ""} onChange={(event) => onChange(field, event.target.value)} /> : <Input className="mt-2" disabled={readOnly} value={(value[field] as string) ?? ""} onChange={(event) => onChange(field, event.target.value)} />}</label>)}</div>;
}

function CollectionFields({ value, onChange, readOnly }: { value: WorkSections["collection"]; onChange: (value: WorkSections["collection"]) => void; readOnly: boolean }) {
  return <ListSection title="Campaign reels" description="Add campaign categories and a YouTube video for each reel." items={value.items} readOnly={readOnly} onChange={(items) => onChange({ ...value, items: items as WorkSections["collection"]["items"] })} renderItem={(item, update) => <><div className="grid gap-4 md:grid-cols-2"><TextField label="Campaign reel title" value={item.title ?? ""} disabled={readOnly} onChange={(title) => update({ title })} /><TextField label="YouTube video URL" value={item.videos?.[0] ?? ""} disabled={readOnly} onChange={(url) => update({ videos: url.trim() ? [url] : [] })} /></div><TextField label="Copy" textarea value={item.copy ?? ""} disabled={readOnly} onChange={(copy) => update({ copy })} /></>} />;
}

function ProcessFields({ value, onChange, readOnly }: { value: WorkSections["process"]; onChange: (value: WorkSections["process"]) => void; readOnly: boolean }) {
  return <><CopyFields fields={["eyebrow", "title", "description"]} value={value} onChange={(key, next) => onChange({ ...value, [key]: next })} readOnly={readOnly} /><ListSection title="Campaign process" description="Add the stages displayed on the Work page." items={value.stages} readOnly={readOnly} onChange={(stages) => onChange({ ...value, stages: stages as WorkSections["process"]["stages"] })} renderItem={(item, update) => <><TextField label="Title" value={item.title ?? ""} disabled={readOnly} onChange={(title) => update({ title })} /><TextField label="Copy" textarea value={item.copy ?? ""} disabled={readOnly} onChange={(copy) => update({ copy })} /></>} /></>;
}

function FaqFields({ value, onChange, readOnly }: { value: WorkSections["faq"]; onChange: (value: WorkSections["faq"]) => void; readOnly: boolean }) {
  return <><CopyFields fields={["eyebrow", "title"]} value={value} onChange={(key, next) => onChange({ ...value, [key]: next })} readOnly={readOnly} /><ListSection title="Frequently asked questions" description="Add or refine commonly asked campaign questions." items={value.items} readOnly={readOnly} addLabel="Add question" onChange={(items) => onChange({ ...value, items: items as WorkSections["faq"]["items"] })} renderItem={(item, update) => <><TextField label="Question" value={item.question ?? ""} disabled={readOnly} onChange={(question) => update({ question })} /><TextField label="Answer" textarea value={item.answer ?? ""} disabled={readOnly} onChange={(answer) => update({ answer })} /></>} /></>;
}

function ListSection({ title, description, items, onChange, readOnly, renderItem, addLabel = "Add item" }: { title: string; description: string; items: ListItem[]; onChange: (items: ListItem[]) => void; readOnly: boolean; renderItem: (item: ListItem, update: (patch: Partial<ListItem>) => void) => ReactNode; addLabel?: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<ListItem>(() => createListItem(0));
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const updateItem = (index: number, patch: Partial<ListItem>) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const addItem = () => { onChange([...items, { ...draft, id: `item-${crypto.randomUUID()}`, order: items.length }]); setDraft(createListItem(items.length + 1)); setIsAdding(false); };
  const removeItem = () => { if (!pendingRemoval) return; onChange(items.filter((item) => item.id !== pendingRemoval).map((item, order) => ({ ...item, order }))); setPendingRemoval(null); };
  return <section className="mt-6 rounded-lg border border-[#c5d4cd] bg-[#f7fbf9] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d8e4de] pb-4"><div><h3 className="font-bold text-[#173c38]">{title}</h3><p className="mt-1 text-sm text-[#61746d]">{description}</p></div><Button type="button" size="sm" disabled={readOnly || isAdding} onClick={() => setIsAdding(true)}><Plus />{addLabel}</Button></div><div className="mt-4 space-y-3">{items.map((item, index) => <article className="rounded-md border bg-white p-4" key={item.id}><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.14em] text-[#61746d]">{title.slice(0, -1)} {index + 1}</span><Button type="button" variant="ghost" size="icon" className="text-destructive" disabled={readOnly} onClick={() => setPendingRemoval(item.id)} aria-label={`Remove ${title.slice(0, -1).toLowerCase()} ${index + 1}`}><Trash2 className="size-4" /></Button></div><div className="space-y-4">{renderItem(item, (patch) => updateItem(index, patch))}</div></article>)}{isAdding ? <AddItemPanel draft={draft} setDraft={setDraft} readOnly={readOnly} onCancel={() => setIsAdding(false)} onAdd={addItem} /> : null}</div><AlertDialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this item?</AlertDialogTitle><AlertDialogDescription>This removes it from the draft. Save changes to publish the update.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={removeItem}>Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></section>;
}

function AddItemPanel({ draft, setDraft, readOnly, onCancel, onAdd }: { draft: ListItem; setDraft: (value: ListItem) => void; readOnly: boolean; onCancel: () => void; onAdd: () => void }) {
  return <div className="rounded-md border border-dashed border-[#89a79d] bg-white p-4"><p className="mb-3 text-sm font-semibold text-[#315b55]">New item</p><div className="grid gap-4 md:grid-cols-2"><TextField label="Title or question" value={draft.title ?? draft.question ?? ""} disabled={readOnly} onChange={(title) => setDraft({ ...draft, title, question: title })} /><TextField label="Copy or answer" textarea value={draft.copy ?? draft.answer ?? ""} disabled={readOnly} onChange={(copy) => setDraft({ ...draft, copy, answer: copy })} /></div><div className="mt-4 flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="button" disabled={readOnly} onClick={onAdd}>Add item</Button></div></div>;
}

function TextField({ label, value, onChange, disabled, textarea = false }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; textarea?: boolean }) {
  return <label className="block"><Label>{label}</Label>{textarea ? <Textarea className="mt-2 min-h-24" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} /> : <Input className="mt-2" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function createListItem(order: number): ListItem { return { id: "", title: "", question: "", copy: "", answer: "", videos: [], order }; }
