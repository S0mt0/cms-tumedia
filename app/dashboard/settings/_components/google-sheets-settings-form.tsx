"use client";

import { useState, useTransition } from "react";

import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { saveGoogleSheetsSettings } from "@/lib/actions/settings.actions";
import type { ActionResult } from "@/lib/types/content";

export function GoogleSheetsSettingsForm({ initialValue, environmentManaged }: { initialValue: string; environmentManaged: boolean }) {
  const [spreadsheetId, setSpreadsheetId] = useState(initialValue);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  return <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); startTransition(async () => setResult(await saveGoogleSheetsSettings({ spreadsheetId }))); }}><label className="block text-sm font-medium text-slate-700" htmlFor="google-sheets-id">Spreadsheet ID<input id="google-sheets-id" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" value={spreadsheetId} disabled={environmentManaged} onChange={(event) => setSpreadsheetId(event.target.value)} /></label>{environmentManaged ? <p className="text-sm text-slate-600">An environment spreadsheet ID is currently taking precedence over this saved value.</p> : null}<Button type="submit" className="min-h-11 px-4" disabled={pending || environmentManaged}>{pending ? "Saving…" : "Save Google Sheets ID"}</Button><FormFeedback result={result} /></form>;
}
