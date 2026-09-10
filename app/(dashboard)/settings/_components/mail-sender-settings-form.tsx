"use client";

import { useState, useTransition } from "react";

import { notifyActionResult } from "@/components/common/action-toast";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveMailServiceSettings } from "@/lib/actions/settings.actions";
import type { ActionResult } from "@/lib/types/content";

export function MailSenderSettingsForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [senderName, setSenderName] = useState(initialName);
  const [mailFrom, setMailFrom] = useState(initialEmail);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();

  return <form className="max-w-2xl space-y-5" onSubmit={(event) => { event.preventDefault(); startTransition(async () => { const next = await saveMailServiceSettings({ senderName, mailFrom }); setResult(next); notifyActionResult(next); }); }}><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700" htmlFor="mail-sender-name">Sender name<Input id="mail-sender-name" className="mt-2" value={senderName} onChange={(event) => setSenderName(event.target.value)} /></label><label className="text-sm font-semibold text-slate-700" htmlFor="mail-sender-email">From email<Input id="mail-sender-email" className="mt-2" type="email" value={mailFrom} onChange={(event) => setMailFrom(event.target.value)} /></label></div><p className="text-sm leading-6 text-[#61746d]">This name and address are used as the sender for CMS emails, including magic links.</p><div className="flex flex-wrap items-center gap-3"><Button type="submit" size="lg" className="min-h-11 rounded-md bg-[#155e58] px-4 hover:bg-[#104b46]" disabled={pending}>{pending ? "Saving…" : "Save mail sender"}</Button><FormFeedback result={result} /></div></form>;
}
