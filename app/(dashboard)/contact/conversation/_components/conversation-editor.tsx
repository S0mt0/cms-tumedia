"use client";

import { LabeledInput } from "@/components/forms/labeled-input";
import { ContactSectionEditor } from "../../_components/contact-section-editor";
import { ContactCopyFields } from "../../_components/contact-copy-fields";
import type { ContactSections } from "@/lib/types/contact";

export function ConversationEditor({ initial }: { initial: ContactSections["conversation"] }) {
  return <ContactSectionEditor section="conversation" initial={initial} title="Conversation content" description="Set the form introduction and optional creator application prompt.">{({ value, readOnly, onChange }) => <div className="space-y-6"><ContactCopyFields idPrefix="contact-conversation" {...value} readOnly={readOnly} onChange={(patch) => onChange({ ...value, ...patch })} /><section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5"><h3 className="text-sm font-bold text-[#163a37]">Creator prompt</h3><p className="mt-1 text-sm text-[#61746d]">An optional, compact route for visitors who are applying as creators.</p><div className="mt-4 grid gap-4 md:grid-cols-2"><LabeledInput id="contact-creator-prompt" label="Prompt" readOnly={readOnly} value={value.creatorPrompt ?? ""} onChange={(creatorPrompt) => onChange({ ...value, creatorPrompt: creatorPrompt || undefined })} /><LabeledInput id="contact-creator-label" label="Link label" readOnly={readOnly} value={value.creatorLinkLabel ?? ""} onChange={(creatorLinkLabel) => onChange({ ...value, creatorLinkLabel: creatorLinkLabel || undefined })} /></div></section></div>}</ContactSectionEditor>;
}
