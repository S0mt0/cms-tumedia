import { ModuleCard } from "@/components/common/module-card";
import { Input } from "@/components/ui/input";
import type { DraftSetter, SiteDraft } from "./site-editor-types";

const fields = [
  ["name", "Organisation name"],
  ["email", "Organisation email"],
  ["phone", "Phone"],
  ["address", "Address"],
] as const;
export function SiteOrganisationCard({
  draft,
  setDraft,
}: {
  draft: SiteDraft;
  setDraft: DraftSetter;
}) {
  return (
    <ModuleCard
      title="Organisation"
      description="Public identity and contact details used across the website."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className="text-sm font-semibold text-slate-700">
            {label}
            <Input
              className="mt-2"
              value={draft.organisation[key] ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  organisation: {
                    ...current.organisation,
                    [key]: event.target.value,
                  },
                }))
              }
            />
          </label>
        ))}
      </div>
    </ModuleCard>
  );
}
