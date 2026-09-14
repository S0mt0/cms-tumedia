"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { FormFeedback } from "@/components/forms/form-feedback";
import { notifyActionResult } from "@/components/common/action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveGoogleSheetsSettings } from "@/lib/actions/settings.actions";
import type { ActionResult } from "@/lib/types/content";

const GOOGLE_SHEETS_SERVICE_ACCOUNT =
  "tu-media-sheets@tumedia-505019.iam.gserviceaccount.com";

export function GoogleSheetsSettingsForm({
  initialValue,
  environmentFallback,
}: {
  initialValue: string;
  environmentFallback: boolean;
}) {
  const [spreadsheetId, setSpreadsheetId] = useState(initialValue);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  async function copyServiceAccountEmail() {
    try {
      await navigator.clipboard.writeText(GOOGLE_SHEETS_SERVICE_ACCOUNT);
      toast.success("Service account email copied.");
    } catch {
      toast.error("Could not copy the email. Please copy it manually.");
    }
  }
  return (
    <form
      className="max-w-2xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const next = await saveGoogleSheetsSettings({ spreadsheetId });
          setResult(next);
          notifyActionResult(next);
        });
      }}
    >
      <label
        className="block text-sm font-semibold text-slate-700"
        htmlFor="google-sheets-id"
      >
        Spreadsheet ID
        <Input
          id="google-sheets-id"
          className="mt-2"
          value={spreadsheetId}
          onChange={(event) => setSpreadsheetId(event.target.value)}
        />
      </label>
      {environmentFallback ? (
        <p className="border-l-2 border-[#d9a648] bg-[#fff9ec] px-3 py-2 text-sm leading-6 text-[#725623]">
          This field currently shows the environment fallback. Saving a value
          here creates a database override.
        </p>
      ) : null}
      <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
        <h3 className="text-sm font-bold text-[#163a37]">Google Sheets service account</h3>
        <p className="mt-1 text-sm leading-6 text-[#61746d]">
          Share every spreadsheet you connect with this account as an
          <strong className="font-semibold text-[#315b55]"> Editor</strong>.
          It is the secure Google identity the CMS uses to create tabs, format
          headers, and write submission rows; it does not grant the CMS access
          to unshared spreadsheets.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 break-all rounded-sm border border-[#d7e1dc] bg-white px-3 py-2 text-sm text-[#315b55]">
            {GOOGLE_SHEETS_SERVICE_ACCOUNT}
          </code>
          <Button type="button" variant="outline" className="min-h-10 shrink-0" onClick={copyServiceAccountEmail}>
            <Copy aria-hidden="true" /> Copy email
          </Button>
        </div>
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          className="min-h-11 rounded-md bg-[#155e58] px-4 hover:bg-[#104b46]"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save Google Sheets ID"}
        </Button>
        <FormFeedback result={result} />
      </div>
    </form>
  );
}
