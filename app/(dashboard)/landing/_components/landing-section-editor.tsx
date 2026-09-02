"use client";

import { Save } from "lucide-react";
import { useState, useTransition } from "react";

import { FormFeedback } from "@/components/forms/form-feedback";
import { notifyActionResult } from "@/components/common/action-toast";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateLandingSection } from "@/lib/actions/landing.actions";
import type { LandingSectionKey } from "@/lib/constants/landing-sections";
import type { ActionResult } from "@/lib/types/content";
import type { LandingSections } from "@/lib/types/landing";

const labels: Record<string, string> = {
  eyebrow: "Eyebrow",
  title: "Heading",
  emphasis: "Emphasised words",
  description: "Supporting copy",
  primaryCta: "Primary action",
  secondaryCta: "Secondary action",
  cta: "Action",
  label: "Button label",
  href: "Destination",
  url: "Media URL",
  alt: "Alternative text",
  scrollLabel: "Scroll prompt",
  imageWordmark: "Image overlay",
  mediaCaption: "Image caption",
  youtubeUrl: "YouTube embed URL",
  videoTitle: "Video title",
  featuredCount: "Number of posts",
  stats: "Statistics",
  marqueeItems: "Marquee topics",
  steps: "Process steps",
  items: "Items",
  media: "Media",
  backgroundMedia: "Background media",
  image: "Image",
  question: "Question",
  answer: "Answer",
  value: "Value",
  text: "Copy",
};

function pretty(key: string) {
  return (
    labels[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase())
  );
}

function updateAt(value: unknown, path: string[], next: unknown): unknown {
  if (!path.length) return next;

  const [key, ...rest] = path;

  if (Array.isArray(value)) {
    const index = Number(key);
    return value.map((item, itemIndex) =>
      itemIndex === index ? updateAt(item, rest, next) : item
    );
  }

  return {
    ...(value as Record<string, unknown>),
    [key]: updateAt((value as Record<string, unknown>)[key], rest, next),
  };
}

function LandingFields({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: string[];
  onChange: (path: string[], value: unknown) => void;
}) {
  if (typeof value === "string" || typeof value === "number") {
    const key = path.at(-1) ?? "";
    const multiline = [
      "description",
      "answer",
      "text",
      "imageWordmark",
    ].includes(key);

    return (
      <label className="block text-sm font-semibold text-slate-700">
        <span>{pretty(key)}</span>
        {multiline ? (
          <Textarea
            value={String(value)}
            onChange={(event) => onChange(path, event.target.value)}
            className="mt-2 min-h-28 bg-white leading-6"
          />
        ) : (
          <Input
            value={String(value)}
            onChange={(event) =>
              onChange(
                path,
                typeof value === "number"
                  ? Number(event.target.value)
                  : event.target.value
              )
            }
            className="mt-2 h-11 bg-white"
          />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-800">
          {pretty(path.at(-1) ?? "")}
        </legend>
        {value.map((item, index) => (
          <div
            className="border border-[#c5d4cd] bg-[#f6faf8] p-4"
            key={(item as { id?: string }).id ?? index}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#52736a]">
              Item {index + 1}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <LandingFields
                value={item}
                path={[...path, String(index)]}
                onChange={onChange}
              />
            </div>
          </div>
        ))}
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(value)
          .filter(([key]) => !["id", "order"].includes(key))
          .map(([key, item]) => {
            const grouped = item !== null && typeof item === "object";
            const fullWidth =
              Array.isArray(item) ||
              ["description", "imageWordmark", "mediaCaption"].includes(key);

            return (
              <div
                className={fullWidth ? "md:col-span-2" : undefined}
                key={key}
              >
                {grouped ? (
                  <section className="border border-[#c5d4cd] bg-[#f6faf8] p-4">
                    <h3 className="mb-4 text-sm font-semibold text-[#163a37]">
                      {pretty(key)}
                    </h3>
                    <LandingFields
                      value={item}
                      path={[...path, key]}
                      onChange={onChange}
                    />
                  </section>
                ) : (
                  <LandingFields
                    value={item}
                    path={[...path, key]}
                    onChange={onChange}
                  />
                )}
              </div>
            );
          })}
      </div>
    );
  }

  return null;
}

type LandingSectionEditorProps = {
  section: LandingSectionKey;
  title: string;
  description: string;
  initial: LandingSections[LandingSectionKey];
};

export function LandingSectionEditor({
  section,
  title,
  description,
  initial,
}: LandingSectionEditorProps) {
  const [draft, setDraft] = useState(initial);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const nextResult = await updateLandingSection({ section, data: draft });
      setResult(nextResult);
      notifyActionResult(nextResult);
    });
  }

  return (
    <ModuleCard title={title} description={description}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="space-y-5">
            <LandingFields
              value={draft}
              path={[]}
              onChange={(path, next) =>
                setDraft(
                  (current) => updateAt(current, path, next) as typeof current
                )
              }
            />
          </div>
          <aside className="h-fit border border-[#c5d4cd] bg-[#edf6f2] p-4 xl:sticky xl:top-8">
            <p className="text-sm font-semibold text-[#163a37]">Publishing</p>
            <p className="mt-2 text-sm leading-6 text-[#52736a]">
              Save changes to refresh this section in the public landing-page
              payload.
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="mt-5 min-h-11 w-full rounded-md bg-[#155e58] hover:bg-[#104b46]"
            >
              <Save className="size-4" aria-hidden />
              {pending ? "Saving…" : "Save section"}
            </Button>
            <div className="mt-4">
              <FormFeedback result={result} />
            </div>
          </aside>
        </div>
      </form>
    </ModuleCard>
  );
}
