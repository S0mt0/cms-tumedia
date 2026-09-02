"use client";

import { useState, useTransition } from "react";

import { FormFeedback } from "@/components/forms/form-feedback";
import { notifyActionResult } from "@/components/common/action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveGoogleSheetsSettings } from "@/lib/actions/settings.actions";
import type { ActionResult } from "@/lib/types/content";

export function GoogleSheetsSettingsForm({
  initialValue,
  environmentManaged,
}: {
  initialValue: string;
  environmentManaged: boolean;
}) {
  const [spreadsheetId, setSpreadsheetId] = useState(initialValue);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
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
          disabled={environmentManaged}
          onChange={(event) => setSpreadsheetId(event.target.value)}
        />
      </label>
      {environmentManaged ? (
        <p className="border-l-2 border-[#d9a648] bg-[#fff9ec] px-3 py-2 text-sm leading-6 text-[#725623]">
          An environment spreadsheet ID currently takes precedence over this
          saved value.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          className="min-h-11 rounded-md bg-[#155e58] px-4 hover:bg-[#104b46]"
          disabled={pending || environmentManaged}
        >
          {pending ? "Saving…" : "Save Google Sheets ID"}
        </Button>
        <FormFeedback result={result} />
      </div>
    </form>
  );
}
