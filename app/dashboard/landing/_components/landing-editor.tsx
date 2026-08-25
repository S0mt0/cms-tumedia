"use client";

import { Pencil, Save, X } from "lucide-react";
import { useState, useTransition } from "react";

import { FormFeedback } from "@/components/forms/form-feedback";
import { ModuleCard } from "@/components/common/module-card";
import { updateLandingSection } from "@/lib/actions/landing.actions";
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
const sections: {
  key: keyof LandingSections;
  title: string;
  description: string;
}[] = [
  {
    key: "hero",
    title: "Hero",
    description: "The opening statement and primary routes.",
  },
  {
    key: "positioning",
    title: "Positioning",
    description: "Your point of view, proof points, and marquee.",
  },
  {
    key: "process",
    title: "Process",
    description: "How brands move from a brief to launch.",
  },
  {
    key: "creatorFlowCta",
    title: "Creator network",
    description: "The creator application invitation.",
  },
  {
    key: "industriesPreview",
    title: "Industries",
    description: "Focus areas shown on the home page.",
  },
  {
    key: "videoShowcase",
    title: "Selected work",
    description: "Featured video and project invitation.",
  },
  {
    key: "whyTuMedia",
    title: "Why TU Media",
    description: "The collaboration promise.",
  },
  {
    key: "blogPreview",
    title: "Blog preview",
    description: "Labels and number of compatibility posts.",
  },
  {
    key: "faq",
    title: "Questions",
    description: "Answers for prospective brands and creators.",
  },
  {
    key: "finalCta",
    title: "Final invitation",
    description: "The closing conversion message.",
  },
];
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
    return value.map((item, i) =>
      i === index ? updateAt(item, rest, next) : item
    );
  }
  return {
    ...(value as Record<string, unknown>),
    [key]: updateAt((value as Record<string, unknown>)[key], rest, next),
  };
}
function Fields({
  value,
  path,
  onChange,
  disabled,
}: {
  value: unknown;
  path: string[];
  onChange: (path: string[], value: unknown) => void;
  disabled: boolean;
}) {
  if (typeof value === "string" || typeof value === "number") {
    const key = path.at(-1)!;
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
          <textarea
            disabled={disabled}
            value={String(value)}
            onChange={(event) => onChange(path, event.target.value)}
            className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal leading-6 disabled:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
          />
        ) : (
          <input
            disabled={disabled}
            value={String(value)}
            onChange={(event) =>
              onChange(
                path,
                typeof value === "number"
                  ? Number(event.target.value)
                  : event.target.value
              )
            }
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal disabled:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
          />
        )}
      </label>
    );
  }
  if (Array.isArray(value))
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          {pretty(path.at(-1) ?? "")}
        </p>
        {value.map((item, index) => (
          <div
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            key={(item as { id?: string }).id ?? index}
          >
            <span className="mb-3 block text-xs font-bold uppercase tracking-[.14em] text-[#7047eb]">
              {index + 1}
            </span>
            <div className="grid gap-4 md:grid-cols-2">
              <Fields
                value={item}
                path={[...path, String(index)]}
                onChange={onChange}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    );
  if (value && typeof value === "object")
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(value)
          .filter(([key]) => !["id", "order"].includes(key))
          .map(([key, item]) => (
            <Fields
              key={key}
              value={item}
              path={[...path, key]}
              onChange={onChange}
              disabled={disabled}
            />
          ))}
      </div>
    );
  return null;
}
export function LandingEditor({ initial }: { initial: LandingSections }) {
  const [data, setData] = useState(initial);
  const [editing, setEditing] = useState<keyof LandingSections | null>(null);
  const [result, setResult] = useState<ActionResult>();
  const [pending, start] = useTransition();
  return (
    <div className="space-y-5">
      {sections.map((section) => {
        const active = editing === section.key;
        const value = data[section.key];
        return (
          <ModuleCard
            key={section.key}
            title={section.title}
            description={section.description}
          >
            <div className="mb-5 flex justify-end gap-2">
              {active ? (
                <>
                  <button
                    onClick={() => {
                      setData(initial);
                      setEditing(null);
                    }}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        setResult(
                          await updateLandingSection({
                            section: section.key,
                            data: value,
                          })
                        );
                        setEditing(null);
                      })
                    }
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0b0d17] px-4 text-sm font-semibold text-white"
                  >
                    <Save size={16} />
                    Save changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(section.key)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              )}
            </div>
            <Fields
              value={value}
              path={[]}
              disabled={!active}
              onChange={(path, next) =>
                setData((current) => ({
                  ...current,
                  [section.key]: updateAt(
                    current[section.key],
                    path,
                    next
                  ) as LandingSections[typeof section.key],
                }))
              }
            />
            <div className="mt-4">
              <FormFeedback result={result} />
            </div>
          </ModuleCard>
        );
      })}
    </div>
  );
}
