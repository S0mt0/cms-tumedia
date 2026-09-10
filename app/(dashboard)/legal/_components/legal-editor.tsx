"use client";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { notifyActionResult } from "@/components/common/action-toast";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLegalDocument } from "@/lib/actions/legal.actions";
import type { LegalDocument } from "@/lib/types/legal";
const TextEditor = dynamic(() => import("@/components/forms/text-editor").then((module) => module.TextEditor), { ssr: false, loading: () => <div className="min-h-56 rounded-md border border-dashed border-[#b8cec4] bg-[#f8fbf9] p-5 text-sm text-[#61746d]">Preparing the legal document editor…</div> });
export function LegalEditor({ initial }: { initial: { terms: LegalDocument; privacy: LegalDocument } }) { const [draft, setDraft] = useState(initial); const [pending, startTransition] = useTransition(); const update = (section: "terms" | "privacy", patch: Partial<LegalDocument>) => setDraft((current) => ({ ...current, [section]: { ...current[section], ...patch } })); const save = (section: "terms" | "privacy") => startTransition(async () => notifyActionResult(await updateLegalDocument({ section, data: draft[section] }))); return <div className="space-y-6">{(["terms", "privacy"] as const).map((section) => <ModuleCard key={section} title={section === "terms" ? "Terms of service" : "Privacy policy"} description="Changes remain local until you save this document."><div className="space-y-5"><div className="grid gap-5 md:grid-cols-2"><label><Label>Document title</Label><Input className="mt-2" value={draft[section].title} disabled={pending} onChange={(event) => update(section, { title: event.target.value })} /></label><label><Label>Updated label</Label><Input className="mt-2" value={draft[section].updatedLabel} disabled={pending} onChange={(event) => update(section, { updatedLabel: event.target.value })} /></label></div><TextEditor value={draft[section].content} disabled={pending} onChange={(content) => update(section, { content })} /><div className="flex justify-end"><Button type="button" disabled={pending} onClick={() => save(section)}>Save {section === "terms" ? "terms" : "privacy policy"}</Button></div></div></ModuleCard>)}</div>; }
