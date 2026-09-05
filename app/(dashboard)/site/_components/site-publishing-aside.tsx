import { Save } from "lucide-react";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types/content";
export function SitePublishingAside({
  pending,
  result,
}: {
  pending: boolean;
  result?: ActionResult;
}) {
  return (
    <aside className="h-fit border border-[#c5d4cd] bg-[#edf6f2] p-4 xl:sticky xl:top-8">
      <p className="text-sm font-semibold text-[#163a37]">Publishing</p>
      <p className="mt-2 text-sm leading-6 text-[#52736a]">
        Changes are available to the public API immediately after the cache is
        invalidated.
      </p>
      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="mt-5 min-h-11 w-full rounded-md bg-[#155e58] hover:bg-[#104b46]"
      >
        <Save className="size-4" />
        {pending ? "Saving…" : "Save site settings"}
      </Button>
      <div className="mt-4">
        <FormFeedback result={result} />
      </div>
    </aside>
  );
}
