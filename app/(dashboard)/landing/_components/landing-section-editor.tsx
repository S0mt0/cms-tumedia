"use client";

import { Dialog } from "@base-ui/react/dialog";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {
  GripVertical,
  ImagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { MediaPreview } from "@/components/common/media-preview";
import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { notifyActionResult } from "@/components/common/action-toast";
import { FormFeedback } from "@/components/forms/form-feedback";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateLandingSection } from "@/lib/actions/landing.actions";
import { marqueeIconOptions } from "@/lib/constants/marquee-icons";
import type { LandingSectionKey } from "@/lib/constants/landing-sections";
import type { ActionResult } from "@/lib/types/content";
import type {
  HeroBackgroundMedia,
  LandingSections,
  MediaRef,
} from "@/lib/types/landing";

const labels: Record<string, string> = {
  eyebrow: "Eyebrow",
  title: "Heading",
  emphasis: "Emphasised words",
  description: "Supporting copy",
  cta: "Call to Action (CTA) button",
  primaryCta: "Primary action",
  label: "Label",
  href: "Destination",
  scrollLabel: "Scroll prompt",
  imageWordmark: "Image overlay",
  mediaCaption: "Image caption",
  youtubeUrl: "YouTube URL",
  videoTitle: "Video title",
  featuredCount: "Featured posts",
  stats: "Statistics",
  marqueeItems: "Marquee topics",
  steps: "Process steps",
  items: "Items",
  media: "Image",
  image: "Image",
  question: "Question",
  answer: "Answer",
  value: "Value",
  text: "Copy",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

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

function isMediaReference(value: unknown, key: string) {
  return (
    (key === "media" || key === "image") &&
    !!value &&
    typeof value === "object" &&
    typeof (value as MediaRef).url === "string" &&
    typeof (value as MediaRef).alt === "string"
  );
}

function hasSideMedia(value: unknown): value is { media: MediaRef } {
  return (
    !!value &&
    typeof value === "object" &&
    "media" in value &&
    isMediaReference((value as { media: unknown }).media, "media")
  );
}

function getMediaCompanionKeys(value: unknown) {
  if (!value || typeof value !== "object") return [];

  return ["imageWordmark", "mediaCaption"].filter(
    (key) => typeof (value as Record<string, unknown>)[key] === "string"
  );
}

function MediaField({
  baseUrl,
  label,
  onChange,
  readOnly,
  value,
}: {
  baseUrl: string;
  label: string;
  onChange: (value: MediaRef) => void;
  readOnly: boolean;
  value: MediaRef;
}) {
  const [open, setOpen] = useState(false);

  async function select(media: HeroBackgroundMedia): Promise<ActionResult> {
    if (media.type !== "image") {
      return { success: false, message: "This section needs an image." };
    }

    onChange({ url: media.url, alt: media.alt });
    return {
      success: true,
      message: "Image selected. Save the section to publish it.",
    };
  }

  return (
    <section className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]">
      <div className="flex items-center justify-between gap-3 border-b border-[#d7e1dc] px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-[#163a37]">{label}</h3>
          <p className="mt-1 text-xs text-[#61746d]">
            Image with required alternative text
          </p>
        </div>
        <Button
          disabled={readOnly}
          onClick={() => setOpen(true)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ImagePlus aria-hidden /> Change
        </Button>
      </div>
      <MediaPreview
        baseUrl={baseUrl}
        className="h-52"
        media={{ type: "image", ...value }}
      />
      <p className="border-t border-[#d7e1dc] px-4 py-3 text-xs leading-5 text-[#61746d]">
        {value.alt}
      </p>
      <MediaUploadDialog
        allowedTypes={["image"]}
        baseUrl={baseUrl}
        description="Upload or choose the image used by this landing-page section."
        disabled={readOnly}
        onOpenChange={setOpen}
        onSelect={select}
        open={open}
        title={label}
        value={{ type: "image", ...value }}
      />
    </section>
  );
}

type OrderedItem = { id: string; order: number };

function normaliseOrder<TItem extends OrderedItem>(items: TItem[]) {
  return items.map((item, order) => ({ ...item, order }));
}

function createItemId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

function ReorderableItem({
  children,
  disabled,
  id,
  index,
  onRemove,
  title,
}: {
  children: React.ReactNode;
  disabled: boolean;
  id: string;
  index: number;
  onRemove: () => void;
  title: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled,
    });

  return (
    <section
      className="rounded-md border border-[#cbd9d3] bg-white"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#e0e8e4] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            aria-label={`Reorder ${title} ${index + 1}`}
            className="cursor-grab text-[#61746d] active:cursor-grabbing"
            disabled={disabled}
            size="icon-sm"
            type="button"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" aria-hidden />
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#58736b]">
            {title} {index + 1}
          </p>
        </div>
        <Button
          className="text-[#9a514c] hover:bg-[#fff0ee] hover:text-[#7d3833]"
          disabled={disabled}
          onClick={onRemove}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" aria-hidden />
          <span className="sr-only">
            Remove {title} {index + 1}
          </span>
        </Button>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

function AddPanel({
  children,
  onCancel,
  onSubmit,
  title,
}: {
  children: React.ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
  title: string;
}) {
  return (
    <section className="rounded-md border border-dashed border-[#8caea1] bg-[#f3f8f5] p-4">
      <p className="text-sm font-bold text-[#163a37]">Add {title}</p>
      <div className="mt-3">{children}</div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button onClick={onCancel} size="sm" type="button" variant="outline">
          <X aria-hidden /> Cancel
        </Button>
        <Button onClick={onSubmit} size="sm" type="button">
          <Plus aria-hidden /> Add {title}
        </Button>
      </div>
    </section>
  );
}

function CollectionHeading({
  addLabel,
  children,
  onAdd,
  readOnly,
  title,
}: {
  addLabel: string;
  children: React.ReactNode;
  onAdd: () => void;
  readOnly: boolean;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-sm font-bold text-[#163a37]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#61746d]">{children}</p>
      </div>
      <Button
        disabled={readOnly}
        onClick={onAdd}
        size="sm"
        type="button"
        variant="outline"
      >
        <Plus aria-hidden /> {addLabel}
      </Button>
    </div>
  );
}

function PositioningLists({
  onChange,
  readOnly,
  value,
}: {
  onChange: (value: LandingSections["positioning"]) => void;
  readOnly: boolean;
  value: LandingSections["positioning"];
}) {
  const [addingStat, setAddingStat] = useState(false);
  const [addingTopic, setAddingTopic] = useState(false);
  const [stat, setStat] = useState({ value: "", label: "" });
  const [topic, setTopic] = useState({
    label: "",
    iconKey: marqueeIconOptions[0].id,
  });
  const update = (patch: Partial<LandingSections["positioning"]>) =>
    onChange({ ...value, ...patch });
  const removeStat = (id: string) => {
    if (value.stats.length === 1 || !window.confirm("Remove this statistic?"))
      return;
    update({
      stats: normaliseOrder(value.stats.filter((item) => item.id !== id)),
    });
  };
  const removeTopic = (id: string) => {
    if (
      value.marqueeItems.length === 1 ||
      !window.confirm("Remove this marquee topic?")
    )
      return;
    update({
      marqueeItems: normaliseOrder(
        value.marqueeItems.filter((item) => item.id !== id)
      ),
    });
  };

  return (
    <div className="space-y-7">
      <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <CollectionHeading
          addLabel="Add statistic"
          onAdd={() => setAddingStat(true)}
          readOnly={readOnly}
          title="Statistics"
        >
          Add, edit, remove, or drag statistics into the order used on the
          landing page.
        </CollectionHeading>
        <SortableDndContainer
          disabled={readOnly}
          items={value.stats}
          onReorder={(items) => update({ stats: normaliseOrder(items) })}
        >
          {(item, index) => (
            <ReorderableItem
              disabled={readOnly}
              id={item.id}
              index={index}
              onRemove={() => removeStat(item.id)}
              title="Statistic"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor={`stat-${item.id}-value`}>Value</Label>
                  <Input
                    className="mt-2"
                    id={`stat-${item.id}-value`}
                    onChange={(event) =>
                      update({
                        stats: value.stats.map((current) =>
                          current.id === item.id
                            ? { ...current, value: event.target.value }
                            : current
                        ),
                      })
                    }
                    readOnly={readOnly}
                    value={item.value}
                  />
                </div>
                <div>
                  <Label htmlFor={`stat-${item.id}-label`}>Description</Label>
                  <Input
                    className="mt-2"
                    id={`stat-${item.id}-label`}
                    onChange={(event) =>
                      update({
                        stats: value.stats.map((current) =>
                          current.id === item.id
                            ? { ...current, label: event.target.value }
                            : current
                        ),
                      })
                    }
                    readOnly={readOnly}
                    value={item.label}
                  />
                </div>
              </div>
            </ReorderableItem>
          )}
        </SortableDndContainer>
        {addingStat ? (
          <AddPanel
            onCancel={() => {
              setAddingStat(false);
              setStat({ value: "", label: "" });
            }}
            onSubmit={() => {
              if (!stat.value.trim() || !stat.label.trim()) return;
              update({
                stats: [
                  ...value.stats,
                  {
                    ...stat,
                    value: stat.value.trim(),
                    label: stat.label.trim(),
                    id: createItemId("stat"),
                    order: value.stats.length,
                  },
                ],
              });
              setAddingStat(false);
              setStat({ value: "", label: "" });
            }}
            title="statistic"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="new-stat-value">Value</Label>
                <Input
                  className="mt-2"
                  id="new-stat-value"
                  onChange={(event) =>
                    setStat((current) => ({
                      ...current,
                      value: event.target.value,
                    }))
                  }
                  value={stat.value}
                />
              </div>
              <div>
                <Label htmlFor="new-stat-label">Description</Label>
                <Input
                  className="mt-2"
                  id="new-stat-label"
                  onChange={(event) =>
                    setStat((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  value={stat.label}
                />
              </div>
            </div>
          </AddPanel>
        ) : null}
      </section>

      <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <CollectionHeading
          addLabel="Add topic"
          onAdd={() => setAddingTopic(true)}
          readOnly={readOnly}
          title="Marquee topics"
        >
          Pair each topic with the icon shown in the moving industry strip.
        </CollectionHeading>
        <SortableDndContainer
          disabled={readOnly}
          items={value.marqueeItems}
          onReorder={(items) => update({ marqueeItems: normaliseOrder(items) })}
        >
          {(item, index) => {
            const Icon =
              marqueeIconOptions.find((option) => option.id === item.iconKey)
                ?.Icon ?? marqueeIconOptions[0].Icon;
            return (
              <ReorderableItem
                disabled={readOnly}
                id={item.id}
                index={index}
                onRemove={() => removeTopic(item.id)}
                title="Topic"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
                  <div>
                    <Label htmlFor={`topic-${item.id}-label`}>Topic</Label>
                    <Input
                      className="mt-2"
                      id={`topic-${item.id}-label`}
                      onChange={(event) =>
                        update({
                          marqueeItems: value.marqueeItems.map((current) =>
                            current.id === item.id
                              ? { ...current, label: event.target.value }
                              : current
                          ),
                        })
                      }
                      readOnly={readOnly}
                      value={item.label}
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      disabled={readOnly}
                      onValueChange={(iconKey) =>
                        update({
                          marqueeItems: value.marqueeItems.map((current) =>
                            current.id === item.id
                              ? {
                                  ...current,
                                  iconKey: iconKey as typeof item.iconKey,
                                }
                              : current
                          ),
                        })
                      }
                      value={item.iconKey}
                    >
                      <SelectTrigger className="mt-2 h-10 w-full border-[#b7c8c0] bg-white">
                        <Icon className="size-4 text-[#176d64]" aria-hidden />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marqueeIconOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ReorderableItem>
            );
          }}
        </SortableDndContainer>
        {addingTopic ? (
          <AddPanel
            onCancel={() => {
              setAddingTopic(false);
              setTopic({ label: "", iconKey: marqueeIconOptions[0].id });
            }}
            onSubmit={() => {
              if (!topic.label.trim()) return;
              update({
                marqueeItems: [
                  ...value.marqueeItems,
                  {
                    id: createItemId("topic"),
                    label: topic.label.trim(),
                    iconKey:
                      topic.iconKey as (typeof value.marqueeItems)[number]["iconKey"],
                    order: value.marqueeItems.length,
                  },
                ],
              });
              setAddingTopic(false);
              setTopic({ label: "", iconKey: marqueeIconOptions[0].id });
            }}
            title="topic"
          >
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
              <div>
                <Label htmlFor="new-topic-label">Topic</Label>
                <Input
                  className="mt-2"
                  id="new-topic-label"
                  onChange={(event) =>
                    setTopic((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  value={topic.label}
                />
              </div>
              <div>
                <Label>Icon</Label>
                <Select
                  onValueChange={(iconKey) =>
                    setTopic((current) => ({
                      ...current,
                      iconKey: iconKey as typeof current.iconKey,
                    }))
                  }
                  value={topic.iconKey}
                >
                  <SelectTrigger className="mt-2 h-10 w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {marqueeIconOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AddPanel>
        ) : null}
      </section>
    </div>
  );
}

function ProcessSteps({
  onChange,
  readOnly,
  value,
}: {
  onChange: (value: LandingSections["process"]) => void;
  readOnly: boolean;
  value: LandingSections["process"];
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const update = (steps: LandingSections["process"]["steps"]) =>
    onChange({ ...value, steps });
  return (
    <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <CollectionHeading
        addLabel="Add step"
        onAdd={() => setAdding(true)}
        readOnly={readOnly}
        title="Process steps"
      >
        Keep the process adaptable. Drag steps to change the order shown
        publicly.
      </CollectionHeading>
      <SortableDndContainer
        disabled={readOnly}
        items={value.steps}
        onReorder={(items) => update(normaliseOrder(items))}
      >
        {(item, index) => (
          <ReorderableItem
            disabled={readOnly}
            id={item.id}
            index={index}
            onRemove={() => {
              if (
                value.steps.length === 1 ||
                !window.confirm("Remove this process step?")
              )
                return;
              update(
                normaliseOrder(
                  value.steps.filter((current) => current.id !== item.id)
                )
              );
            }}
            title="Step"
          >
            <Label htmlFor={`step-${item.id}`}>Heading</Label>
            <Input
              className="mt-2"
              id={`step-${item.id}`}
              onChange={(event) =>
                update(
                  value.steps.map((current) =>
                    current.id === item.id
                      ? { ...current, title: event.target.value }
                      : current
                  )
                )
              }
              readOnly={readOnly}
              value={item.title}
            />
          </ReorderableItem>
        )}
      </SortableDndContainer>
      {adding ? (
        <AddPanel
          onCancel={() => {
            setAdding(false);
            setTitle("");
          }}
          onSubmit={() => {
            if (!title.trim()) return;
            update([
              ...value.steps,
              {
                id: createItemId("step"),
                title: title.trim(),
                order: value.steps.length,
              },
            ]);
            setAdding(false);
            setTitle("");
          }}
          title="step"
        >
          <Label htmlFor="new-step-title">Heading</Label>
          <Input
            className="mt-2"
            id="new-step-title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </AddPanel>
      ) : null}
    </section>
  );
}

function WhyItems({
  onChange,
  readOnly,
  value,
}: {
  onChange: (value: LandingSections["whyTuMedia"]) => void;
  readOnly: boolean;
  value: LandingSections["whyTuMedia"];
}) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const update = (items: LandingSections["whyTuMedia"]["items"]) =>
    onChange({ ...value, items });
  return (
    <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <CollectionHeading
        addLabel="Add point"
        onAdd={() => setAdding(true)}
        readOnly={readOnly}
        title="Why TU Media points"
      >
        Each point appears as a distinct reason to work with TU Media.
      </CollectionHeading>
      <SortableDndContainer
        disabled={readOnly}
        items={value.items}
        onReorder={(items) => update(normaliseOrder(items))}
      >
        {(item, index) => (
          <ReorderableItem
            disabled={readOnly}
            id={item.id}
            index={index}
            onRemove={() => {
              if (
                value.items.length === 1 ||
                !window.confirm("Remove this point?")
              )
                return;
              update(
                normaliseOrder(
                  value.items.filter((current) => current.id !== item.id)
                )
              );
            }}
            title="Point"
          >
            <Label htmlFor={`why-${item.id}`}>Copy</Label>
            <Textarea
              className="mt-2 min-h-24 bg-white"
              id={`why-${item.id}`}
              onChange={(event) =>
                update(
                  value.items.map((current) =>
                    current.id === item.id
                      ? { ...current, text: event.target.value }
                      : current
                  )
                )
              }
              readOnly={readOnly}
              value={item.text}
            />
          </ReorderableItem>
        )}
      </SortableDndContainer>
      {adding ? (
        <AddPanel
          onCancel={() => {
            setAdding(false);
            setText("");
          }}
          onSubmit={() => {
            if (!text.trim()) return;
            update([
              ...value.items,
              {
                id: createItemId("why"),
                text: text.trim(),
                order: value.items.length,
              },
            ]);
            setAdding(false);
            setText("");
          }}
          title="point"
        >
          <Label htmlFor="new-why-text">Copy</Label>
          <Textarea
            className="mt-2 min-h-24 bg-white"
            id="new-why-text"
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
        </AddPanel>
      ) : null}
    </section>
  );
}

function FaqItems({
  onChange,
  readOnly,
  value,
}: {
  onChange: (value: LandingSections["faq"]) => void;
  readOnly: boolean;
  value: LandingSections["faq"];
}) {
  const [adding, setAdding] = useState(false);
  const [item, setItem] = useState({ question: "", answer: "" });
  const update = (items: LandingSections["faq"]["items"]) =>
    onChange({ ...value, items });
  return (
    <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <CollectionHeading
        addLabel="Add question"
        onAdd={() => setAdding(true)}
        readOnly={readOnly}
        title="Questions"
      >
        Open a question to edit its answer, then drag its handle to reorder the
        public FAQ.
      </CollectionHeading>
      <SortableDndContainer
        disabled={readOnly}
        items={value.items}
        onReorder={(items) => update(normaliseOrder(items))}
      >
        {(item, index) => (
          <ReorderableItem
            disabled={readOnly}
            id={item.id}
            index={index}
            onRemove={() => {
              if (
                value.items.length === 1 ||
                !window.confirm("Remove this question?")
              )
                return;
              update(
                normaliseOrder(
                  value.items.filter((current) => current.id !== item.id)
                )
              );
            }}
            title="Question"
          >
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[#163a37] marker:hidden">
                {item.question || "Untitled question"}
                <span className="float-right text-[#61746d] group-open:hidden">
                  Expand
                </span>
              </summary>
              <div className="mt-4 grid gap-4">
                <div>
                  <Label htmlFor={`faq-${item.id}-question`}>Question</Label>
                  <Input
                    className="mt-2"
                    id={`faq-${item.id}-question`}
                    onChange={(event) =>
                      update(
                        value.items.map((current) =>
                          current.id === item.id
                            ? { ...current, question: event.target.value }
                            : current
                        )
                      )
                    }
                    readOnly={readOnly}
                    value={item.question}
                  />
                </div>
                <div>
                  <Label htmlFor={`faq-${item.id}-answer`}>Answer</Label>
                  <Textarea
                    className="mt-2 min-h-28 bg-white"
                    id={`faq-${item.id}-answer`}
                    onChange={(event) =>
                      update(
                        value.items.map((current) =>
                          current.id === item.id
                            ? { ...current, answer: event.target.value }
                            : current
                        )
                      )
                    }
                    readOnly={readOnly}
                    value={item.answer}
                  />
                </div>
              </div>
            </details>
          </ReorderableItem>
        )}
      </SortableDndContainer>
      {adding ? (
        <AddPanel
          onCancel={() => {
            setAdding(false);
            setItem({ question: "", answer: "" });
          }}
          onSubmit={() => {
            if (!item.question.trim() || !item.answer.trim()) return;
            update([
              ...value.items,
              {
                id: createItemId("faq"),
                question: item.question.trim(),
                answer: item.answer.trim(),
                order: value.items.length,
              },
            ]);
            setAdding(false);
            setItem({ question: "", answer: "" });
          }}
          title="question"
        >
          <div className="grid gap-3">
            <div>
              <Label htmlFor="new-faq-question">Question</Label>
              <Input
                className="mt-2"
                id="new-faq-question"
                onChange={(event) =>
                  setItem((current) => ({
                    ...current,
                    question: event.target.value,
                  }))
                }
                value={item.question}
              />
            </div>
            <div>
              <Label htmlFor="new-faq-answer">Answer</Label>
              <Textarea
                className="mt-2 min-h-24 bg-white"
                id="new-faq-answer"
                onChange={(event) =>
                  setItem((current) => ({
                    ...current,
                    answer: event.target.value,
                  }))
                }
                value={item.answer}
              />
            </div>
          </div>
        </AddPanel>
      ) : null}
    </section>
  );
}

type IndustryItem = LandingSections["industriesPreview"]["items"][number];

function IndustryRow({
  baseUrl,
  index,
  item,
  onChange,
  onRemove,
  readOnly,
}: {
  baseUrl: string;
  index: number;
  item: IndustryItem;
  onChange: (item: IndustryItem) => void;
  onRemove: () => void;
  readOnly: boolean;
}) {
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <ReorderableItem
      disabled={readOnly}
      id={item.id}
      index={index}
      onRemove={onRemove}
      title="Industry"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(10rem,.85fr)_minmax(14rem,1.2fr)_9.5rem] md:items-end">
        <div>
          <Label htmlFor={`industry-${item.id}-label`}>Label</Label>
          <Input
            className="mt-2"
            id={`industry-${item.id}-label`}
            onChange={(event) =>
              onChange({ ...item, label: event.target.value })
            }
            readOnly={readOnly}
            value={item.label}
          />
        </div>
        <div>
          <Label htmlFor={`industry-${item.id}-href`}>Destination</Label>
          <Input
            className="mt-2"
            id={`industry-${item.id}-href`}
            onChange={(event) =>
              onChange({ ...item, href: event.target.value })
            }
            readOnly={readOnly}
            value={item.href}
          />
        </div>
        <div className="min-w-0">
          <Label>Image</Label>
          <div className="relative mt-2 w-28 overflow-hidden rounded-sm border border-[#c5d4cd] bg-[#f4f7f5]">
            <MediaPreview
              baseUrl={baseUrl}
              className="h-20 w-28 border-0"
              compact
              emptyLabel=""
              media={{ type: "image", ...item.image }}
              showBrokenPreview={false}
            />
            <Button
              aria-label={`Change image for ${item.label || "industry"}`}
              className="absolute right-1.5 bottom-1.5 bg-white/95 shadow-none hover:bg-white"
              disabled={readOnly}
              onClick={() => setMediaOpen(true)}
              size="icon-xs"
              type="button"
              variant="outline"
            >
              <ImagePlus className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
      <MediaUploadDialog
        allowedTypes={["image"]}
        baseUrl={baseUrl}
        description="Upload or replace the image used beside this industry link."
        disabled={readOnly}
        onOpenChange={setMediaOpen}
        onSelect={async (media) => {
          if (media.type !== "image") {
            return { success: false, message: "Choose an image." };
          }
          onChange({ ...item, image: { url: media.url, alt: media.alt } });
          return {
            success: true,
            message: "Image selected. Save the section to publish it.",
          };
        }}
        open={mediaOpen}
        title={`${item.label || "Industry"} image`}
        value={{ type: "image", ...item.image }}
      />
    </ReorderableItem>
  );
}

function IndustryItems({
  baseUrl,
  onChange,
  readOnly,
  value,
}: {
  baseUrl: string;
  onChange: (value: LandingSections["industriesPreview"]) => void;
  readOnly: boolean;
  value: LandingSections["industriesPreview"];
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    label: "",
    href: "",
    image: { url: "", alt: "" },
  });
  const [mediaOpen, setMediaOpen] = useState(false);
  const update = (items: LandingSections["industriesPreview"]["items"]) =>
    onChange({ ...value, items });
  const add = () => {
    if (
      !draft.label.trim() ||
      !draft.href.trim() ||
      !draft.image.url ||
      !draft.image.alt.trim()
    )
      return;
    update([
      ...value.items,
      {
        id: createItemId("industry"),
        label: draft.label.trim(),
        href: draft.href.trim(),
        image: draft.image,
        order: value.items.length,
      },
    ]);
    setDraft({ label: "", href: "", image: { url: "", alt: "" } });
    setOpen(false);
  };
  return (
    <section className="space-y-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
      <CollectionHeading
        addLabel="Add industry"
        onAdd={() => setOpen(true)}
        readOnly={readOnly}
        title="Industries"
      >
        A compact landing-page directory. Drag rows to control the public order.
      </CollectionHeading>
      <SortableDndContainer
        disabled={readOnly}
        items={value.items}
        onReorder={(items) => update(normaliseOrder(items))}
      >
        {(item, index) => (
          <IndustryRow
            baseUrl={baseUrl}
            index={index}
            item={item}
            onChange={(nextItem) =>
              update(
                value.items.map((current) =>
                  current.id === item.id ? nextItem : current
                )
              )
            }
            onRemove={() => {
              if (
                value.items.length === 1 ||
                !window.confirm("Remove this industry?")
              )
                return;
              update(
                normaliseOrder(
                  value.items.filter((current) => current.id !== item.id)
                )
              );
            }}
            readOnly={readOnly}
          />
        )}
      </SortableDndContainer>
      <Dialog.Root onOpenChange={setOpen} open={open}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#102420]/45 backdrop-blur-[2px]" />
          <Dialog.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
            <Dialog.Popup className="w-full max-w-2xl rounded-md border border-[#9fb6ac] bg-[#fffdfa] text-[#163a37] outline-none">
              <div className="flex items-start justify-between border-b border-[#d7e1dc] px-5 py-4">
                <div>
                  <Dialog.Title className="text-base font-bold">
                    Add industry
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-[#61746d]">
                    Create a compact industry link and its thumbnail.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  render={
                    <Button
                      aria-label="Close add industry"
                      size="icon"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>
              <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="add-industry-label">Label</Label>
                    <Input
                      className="mt-2"
                      id="add-industry-label"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          label: event.target.value,
                        }))
                      }
                      value={draft.label}
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-industry-href">Destination</Label>
                    <Input
                      className="mt-2"
                      id="add-industry-href"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          href: event.target.value,
                        }))
                      }
                      placeholder="/industries#consumer-tech"
                      value={draft.href}
                    />
                  </div>
                  <div>
                    <Label>Image</Label>
                    <Button
                      className="mt-2"
                      onClick={() => setMediaOpen(true)}
                      type="button"
                      variant="outline"
                    >
                      <ImagePlus aria-hidden /> Choose image
                    </Button>
                  </div>
                </div>
                <MediaPreview
                  baseUrl={baseUrl}
                  className="h-52 rounded-md"
                  emptyLabel="Your industry image will appear here."
                  media={
                    draft.image.url
                      ? { type: "image", ...draft.image }
                      : undefined
                  }
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#d7e1dc] px-5 py-4">
                <Dialog.Close
                  render={<Button type="button" variant="outline" />}
                >
                  Cancel
                </Dialog.Close>
                <Button
                  disabled={
                    !draft.label.trim() ||
                    !draft.href.trim() ||
                    !draft.image.url ||
                    !draft.image.alt.trim()
                  }
                  onClick={add}
                  type="button"
                >
                  <Plus aria-hidden /> Add industry
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
      <MediaUploadDialog
        allowedTypes={["image"]}
        baseUrl={baseUrl}
        description="Upload the image shown beside this industry link."
        onOpenChange={setMediaOpen}
        onSelect={async (media) => {
          if (media.type !== "image")
            return { success: false, message: "Choose an image." };
          setDraft((current) => ({
            ...current,
            image: { url: media.url, alt: media.alt },
          }));
          return { success: true, message: "Image selected." };
        }}
        open={mediaOpen}
        title="Industry image"
        value={{ type: "image", ...draft.image }}
      />
    </section>
  );
}

function LandingFields({
  baseUrl,
  omitKeys = [],
  onChange,
  path,
  readOnly,
  value,
}: {
  baseUrl: string;
  value: unknown;
  path: string[];
  readOnly: boolean;
  omitKeys?: string[];
  onChange: (path: string[], value: unknown) => void;
}) {
  const key = path.at(-1) ?? "";

  if (isMediaReference(value, key)) {
    return (
      <MediaField
        baseUrl={baseUrl}
        label={pretty(key)}
        onChange={(next) => onChange(path, next)}
        readOnly={readOnly}
        value={value as MediaRef}
      />
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    const multiline = [
      "description",
      "answer",
      "text",
      "imageWordmark",
    ].includes(key);
    const inputType =
      key === "youtubeUrl"
        ? "url"
        : key === "featuredCount"
        ? "number"
        : "text";

    return (
      <div>
        <Label htmlFor={path.join("-")}>{pretty(key)}</Label>
        {multiline ? (
          <Textarea
            className="mt-2 min-h-28 bg-white leading-6"
            id={path.join("-")}
            onChange={(event) => onChange(path, event.target.value)}
            readOnly={readOnly}
            value={String(value)}
          />
        ) : (
          <Input
            className="mt-2 bg-white"
            id={path.join("-")}
            min={inputType === "number" ? 1 : undefined}
            onChange={(event) =>
              onChange(
                path,
                typeof value === "number"
                  ? Number(event.target.value)
                  : event.target.value
              )
            }
            readOnly={readOnly}
            type={inputType}
            value={String(value)}
          />
        )}
        {key === "youtubeUrl" ? (
          <p className="mt-2 text-xs leading-5 text-[#61746d]">
            Paste a full YouTube or YouTube-nocookie embed URL. No video upload
            is needed.
          </p>
        ) : null}
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (key === "marqueeItems") {
      return (
        <fieldset className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
          <legend className="text-sm font-bold text-[#163a37]">
            Marquee topics
          </legend>
          <p className="mt-1 text-xs leading-5 text-[#61746d]">
            Pair each topic with the icon shown in the moving industry strip.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {value.map((item, index) => {
              const marqueeItem = item as { label: string; iconKey?: string };
              const selectedIcon =
                marqueeIconOptions.find(
                  (option) => option.id === marqueeItem.iconKey
                ) ?? marqueeIconOptions[0];
              const Icon = selectedIcon.Icon;

              return (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_10.5rem] items-end gap-3 rounded-md border border-[#d4e0da] bg-white p-3"
                  key={(item as { id?: string }).id ?? index}
                >
                  <div>
                    <Label htmlFor={`marquee-${index}-label`}>
                      Topic {index + 1}
                    </Label>
                    <Input
                      className="mt-2"
                      id={`marquee-${index}-label`}
                      onChange={(event) =>
                        onChange(
                          [...path, String(index), "label"],
                          event.target.value
                        )
                      }
                      readOnly={readOnly}
                      value={marqueeItem.label}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`marquee-${index}-icon`}>Icon</Label>
                    <Select
                      disabled={readOnly}
                      onValueChange={(iconKey) =>
                        onChange([...path, String(index), "iconKey"], iconKey)
                      }
                      value={marqueeItem.iconKey ?? marqueeIconOptions[0].id}
                    >
                      <SelectTrigger className="mt-2 h-10 w-full border-[#b7c8c0] bg-white">
                        <Icon className="size-4 text-[#176d64]" aria-hidden />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marqueeIconOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      );
    }

    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-[#163a37]">
          {pretty(key)}
        </legend>
        <p className="text-xs leading-5 text-[#61746d]">
          Edit each item below. Their existing order is preserved.
        </p>
        {value.map((item, index) => (
          <section
            className="rounded-md border border-[#d4e0da] bg-[#fffdfa] p-4"
            key={(item as { id?: string }).id ?? index}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-[#58736b]">
              {pretty(key).replace(/s$/, "")} {index + 1}
            </p>
            <LandingFields
              baseUrl={baseUrl}
              onChange={onChange}
              path={[...path, String(index)]}
              readOnly={readOnly}
              value={item}
            />
          </section>
        ))}
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(value as Record<string, unknown>)
          .filter(
            ([childKey]) => !["id", "order", ...omitKeys].includes(childKey)
          )
          .map(([childKey, childValue]) => {
            const grouped =
              childValue !== null && typeof childValue === "object";
            const fieldCount = Object.keys(
              value as Record<string, unknown>
            ).filter(
              (field) => !["id", "order", ...omitKeys].includes(field)
            ).length;
            const fullWidth =
              Array.isArray(childValue) ||
              fieldCount === 1 ||
              [
                "description",
                "imageWordmark",
                "mediaCaption",
                "media",
                "image",
                "cta",
                "primaryCta",
              ].includes(childKey);

            return (
              <div
                className={fullWidth ? "md:col-span-2" : undefined}
                key={childKey}
              >
                {grouped &&
                !Array.isArray(childValue) &&
                !isMediaReference(childValue, childKey) ? (
                  <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
                    <h3 className="mb-4 text-sm font-bold text-[#163a37]">
                      {pretty(childKey)}
                    </h3>
                    <LandingFields
                      baseUrl={baseUrl}
                      onChange={onChange}
                      path={[...path, childKey]}
                      readOnly={readOnly}
                      value={childValue}
                    />
                  </section>
                ) : (
                  <LandingFields
                    baseUrl={baseUrl}
                    onChange={onChange}
                    path={[...path, childKey]}
                    readOnly={readOnly}
                    value={childValue}
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

function SectionCollections({
  baseUrl,
  onChange,
  readOnly,
  section,
  value,
}: {
  baseUrl: string;
  onChange: (
    value: LandingSections[Exclude<LandingSectionKey, "hero">]
  ) => void;
  readOnly: boolean;
  section: Exclude<LandingSectionKey, "hero">;
  value: LandingSections[Exclude<LandingSectionKey, "hero">];
}) {
  if (section === "positioning") {
    return (
      <PositioningLists
        onChange={onChange}
        readOnly={readOnly}
        value={value as LandingSections["positioning"]}
      />
    );
  }
  if (section === "process") {
    return (
      <ProcessSteps
        onChange={onChange}
        readOnly={readOnly}
        value={value as LandingSections["process"]}
      />
    );
  }
  if (section === "industriesPreview") {
    return (
      <IndustryItems
        baseUrl={baseUrl}
        onChange={onChange}
        readOnly={readOnly}
        value={value as LandingSections["industriesPreview"]}
      />
    );
  }
  if (section === "whyTuMedia") {
    return (
      <WhyItems
        onChange={onChange}
        readOnly={readOnly}
        value={value as LandingSections["whyTuMedia"]}
      />
    );
  }
  if (section === "faq") {
    return (
      <FaqItems
        onChange={onChange}
        readOnly={readOnly}
        value={value as LandingSections["faq"]}
      />
    );
  }
  return null;
}

function sectionCollectionKey(section: Exclude<LandingSectionKey, "hero">) {
  if (section === "positioning") return ["stats", "marqueeItems"];
  if (section === "process") return ["steps"];
  if (
    section === "industriesPreview" ||
    section === "whyTuMedia" ||
    section === "faq"
  )
    return ["items"];
  return [];
}

type LandingSectionEditorProps = {
  section: Exclude<LandingSectionKey, "hero">;
  title: string;
  description: string;
  initial: LandingSections[Exclude<LandingSectionKey, "hero">];
  mediaPreviewBaseUrl: string;
};

export function LandingSectionEditor({
  section,
  title,
  description,
  initial,
  mediaPreviewBaseUrl,
}: LandingSectionEditorProps) {
  const [persisted, setPersisted] = useState(() => clone(initial));
  const [draft, setDraft] = useState(() => clone(initial));
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(persisted),
    [draft, persisted]
  );
  const readOnly = !editing || pending;
  const sideMedia = hasSideMedia(draft);
  const mediaCompanionKeys = getMediaCompanionKeys(draft);
  const collectionKeys = sectionCollectionKey(section);

  function discard() {
    setDraft(clone(persisted));
    setResult(undefined);
    setEditing(false);
  }

  function save() {
    if (!isDirty) return;
    startTransition(async () => {
      const next = await updateLandingSection({ section, data: draft });
      setResult(next);
      notifyActionResult(next);
      if (next.success) {
        setPersisted(clone(draft));
        setEditing(false);
      }
    });
  }

  return (
    <section
      className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#fffdfa]"
      data-automated-test-id={`landing-${section}-editor`}
    >
      <header className="flex flex-col gap-4 border-b border-[#d7e1dc] bg-[#f1f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-sm font-bold text-[#163a37]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#61746d]">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <Button
              disabled={pending}
              onClick={discard}
              type="button"
              variant="outline"
            >
              <RotateCcw aria-hidden /> Discard
            </Button>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              type="button"
              variant="outline"
            >
              <Pencil aria-hidden /> Edit section
            </Button>
          )}
          {editing ? (
            <Button disabled={pending || !isDirty} onClick={save} type="button">
              <Save aria-hidden /> {pending ? "Saving…" : "Save changes"}
            </Button>
          ) : null}
        </div>
      </header>

      <form
        className="p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="space-y-6">
          <div className={sideMedia ? "grid gap-6 xl:grid-cols-2" : undefined}>
            <div className="space-y-6">
              <LandingFields
                baseUrl={mediaPreviewBaseUrl}
                omitKeys={[
                  ...(sideMedia ? ["media", ...mediaCompanionKeys] : []),
                  ...collectionKeys,
                ]}
                onChange={(path, next) =>
                  setDraft(
                    (current) => updateAt(current, path, next) as typeof current
                  )
                }
                path={[]}
                readOnly={readOnly}
                value={draft}
              />
              <SectionCollections
                baseUrl={mediaPreviewBaseUrl}
                onChange={(next) => setDraft(next as typeof draft)}
                readOnly={readOnly}
                section={section}
                value={draft}
              />
            </div>
            {sideMedia ? (
              <aside className="self-start xl:sticky xl:top-6">
                <MediaField
                  baseUrl={mediaPreviewBaseUrl}
                  label="Section image"
                  onChange={(media) =>
                    setDraft(
                      (current) => ({ ...current, media } as typeof current)
                    )
                  }
                  readOnly={readOnly}
                  value={draft.media}
                />
                {mediaCompanionKeys.length ? (
                  <section className="mt-4 rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#58736b]">
                      Image details
                    </p>
                    <div className="mt-4">
                      <LandingFields
                        baseUrl={mediaPreviewBaseUrl}
                        onChange={(path, next) =>
                          setDraft(
                            (current) =>
                              updateAt(current, path, next) as typeof current
                          )
                        }
                        path={[]}
                        readOnly={readOnly}
                        value={Object.fromEntries(
                          mediaCompanionKeys.map((key) => [
                            key,
                            (draft as Record<string, unknown>)[key],
                          ])
                        )}
                      />
                    </div>
                  </section>
                ) : null}
                <p className="mt-3 rounded-md border border-[#d4e0da] bg-[#eff7f3] px-4 py-3 text-xs leading-5 text-[#52736a]">
                  This image is managed separately from the copy so you can
                  verify its crop and alternative text at a glance.
                </p>
              </aside>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 border-t border-[#d7e1dc] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#61746d]">
              Edits remain local until you save. A successful save refreshes the
              public landing-page payload.
            </p>
            <Button disabled={pending || !isDirty} type="submit">
              <Save aria-hidden /> {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
          <FormFeedback result={result} />
        </div>
      </form>
    </section>
  );
}
