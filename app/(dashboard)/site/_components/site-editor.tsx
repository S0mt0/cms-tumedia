"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { FormFeedback } from "@/components/forms/form-feedback";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateSite } from "@/lib/actions/site.actions";
import type { ActionResult } from "@/lib/types/content";
import type { SiteContent } from "@/lib/types/site";

type SiteDraft = Pick<
  SiteContent,
  "seo" | "navigation" | "footer" | "organisation"
>;
const fields = [
  ["organisation.name", "Organisation name"],
  ["organisation.email", "Organisation email"],
  ["footer.positioning", "Footer positioning"],
  ["footer.contactEmail", "Footer contact email"],
  ["seo.title", "Default SEO title"],
  ["seo.description", "Default SEO description"],
] as const;
const labels = {
  servicesLabel: "Services",
  industriesLabel: "Industries",
  projectsLabel: "Work",
  blogsLabel: "Blogs",
  aboutLabel: "About",
  creatorsLabel: "For creators",
  contactLabel: "Contact action",
} as const;

function read(draft: SiteDraft, path: string) {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown>)[key],
      draft
    );
}
function write(draft: SiteDraft, path: string, value: string): SiteDraft {
  const [parent, key] = path.split(".");
  return {
    ...draft,
    [parent]: { ...(draft[parent as keyof SiteDraft] as object), [key]: value },
  } as SiteDraft;
}

export function SiteEditor({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState<SiteDraft>({
    seo: initial.seo,
    navigation: initial.navigation,
    footer: initial.footer,
    organisation: initial.organisation,
  });
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const save = () =>
    startTransition(async () => setResult(await updateSite(draft)));
  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="space-y-5">
        <ModuleCard
          title="Organisation"
          description="Public identity and contact details used across the website."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.slice(0, 2).map(([path, label]) => (
              <label
                key={path}
                className="text-sm font-semibold text-slate-700"
              >
                {label}
                <Input
                  value={String(read(draft, path))}
                  onChange={(event) =>
                    setDraft((current) =>
                      write(current, path, event.target.value)
                    )
                  }
                  className="mt-2"
                />
              </label>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard
          title="Navigation labels"
          description="Routes remain code-controlled; only their public labels are editable."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(labels).map(([key, label]) => (
              <label key={key} className="text-sm font-semibold text-slate-700">
                {label}
                <Input
                  value={draft.navigation[key as keyof typeof labels]}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      navigation: {
                        ...current.navigation,
                        [key]: event.target.value,
                      },
                    }))
                  }
                  className="mt-2"
                />
              </label>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard
          title="Footer and SEO"
          description="Global footer copy and search metadata."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.slice(2, 5).map(([path, label]) => (
              <label
                key={path}
                className="text-sm font-semibold text-slate-700 sm:last:col-span-2"
              >
                {label}
                {path === "seo.description" ? (
                  <Textarea
                    value={String(read(draft, path))}
                    onChange={(event) =>
                      setDraft((current) =>
                        write(current, path, event.target.value)
                      )
                    }
                    className="mt-2 min-h-28"
                  />
                ) : (
                  <Input
                    value={String(read(draft, path))}
                    onChange={(event) =>
                      setDraft((current) =>
                        write(current, path, event.target.value)
                      )
                    }
                    className="mt-2"
                  />
                )}
              </label>
            ))}
          </div>
        </ModuleCard>
      </div>
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
    </form>
  );
}
