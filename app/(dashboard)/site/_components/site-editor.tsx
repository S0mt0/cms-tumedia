"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { notifyActionResult } from "@/components/common/action-toast";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaPreview } from "@/components/common/media-preview";
import { MediaUploadDialog } from "@/components/forms/media-upload-dialog";
import { updateSite } from "@/lib/actions/site.actions";
import type { ActionResult } from "@/lib/types/content";
import type { SiteContent } from "@/lib/types/site";
import { SiteOrganisationCard } from "./site-organisation-card";
import { SitePublishingAside } from "./site-publishing-aside";
import type { SiteDraft } from "./site-editor-types";
const fields = [
  ["organisation.name", "Organisation name"],
  ["organisation.email", "Organisation email"],
  ["organisation.phone", "Phone"],
  ["organisation.address", "Address"],
  ["footer.positioning", "Footer positioning"],
  ["seo.title", "Default SEO title"],
  ["seo.description", "Default SEO description"],
] as const;

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
    branding: initial.branding,
    footer: initial.footer,
    organisation: initial.organisation,
  });
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const [mediaTarget, setMediaTarget] = useState<"logo" | "favicon" | null>(
    null
  );
  const save = () =>
    startTransition(async () => {
      const next = await updateSite(draft);
      setResult(next);
      notifyActionResult(next);
    });
  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="space-y-5">
        <SiteOrganisationCard draft={draft} setDraft={setDraft} />
        <ModuleCard
          title="Brand assets"
          description="Logo and favicon are uploaded to R2; changes remain draft-only until you save."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(["logo", "favicon"] as const).map((asset) => (
              <section
                key={asset}
                className="overflow-hidden rounded-md border border-[#c5d4cd] bg-[#f8fbf9]"
              >
                <div className="flex items-center justify-between border-b border-[#d7e1dc] px-3 py-2">
                  <p className="text-sm font-semibold capitalize">{asset}</p>
                  <Button
                    disabled={pending}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMediaTarget(asset)}
                  >
                    <ImagePlus /> Change
                  </Button>
                </div>
                <MediaPreview
                  media={
                    draft.branding[asset]
                      ? { type: "image", ...draft.branding[asset] }
                      : undefined
                  }
                  className="h-32"
                />
              </section>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard
          title="Footer and SEO"
          description="Global footer copy and search metadata."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.slice(5).map(([path, label]) => (
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
        <ModuleCard
          title="Social links"
          description="Use a social ID such as instagram and either a handle or full URL. The public site chooses the icon and normalises handles."
        >
          <div className="space-y-3">
            {draft.footer.socialLinks.map((link) => (
              <div
                key={link.id}
                className="grid gap-3 rounded-md border border-[#d7e1dc] p-3 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <Input
                  aria-label="Social ID"
                  value={link.id}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      footer: {
                        ...current.footer,
                        socialLinks: current.footer.socialLinks.map((item) =>
                          item.id === link.id
                            ? { ...item, id: event.target.value.toLowerCase() }
                            : item
                        ),
                      },
                    }))
                  }
                />
                <Input
                  aria-label="Social URL"
                  value={link.url}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      footer: {
                        ...current.footer,
                        socialLinks: current.footer.socialLinks.map((item) =>
                          item.id === link.id
                            ? { ...item, url: event.target.value }
                            : item
                        ),
                      },
                    }))
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-[#9a514c]"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      footer: {
                        ...current.footer,
                        socialLinks: current.footer.socialLinks
                          .filter((item) => item.id !== link.id)
                          .map((item, order) => ({ ...item, order })),
                      },
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove social link</span>
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  socialLinks: [
                    ...current.footer.socialLinks,
                    {
                      id: "instagram",
                      url: "@tumedia",
                      order: current.footer.socialLinks.length,
                    },
                  ],
                },
              }))
            }
          >
            <Plus className="size-4" /> Add social link
          </Button>
        </ModuleCard>
      </div>
      {mediaTarget ? (
        <MediaUploadDialog
          allowedTypes={["image"]}
          open
          onOpenChange={(open) => !open && setMediaTarget(null)}
          title={`Site ${mediaTarget}`}
          description="Upload an image to use as this global brand asset."
          value={{
            type: "image",
            ...(draft.branding[mediaTarget] ?? {
              url: "",
              alt:
                mediaTarget === "logo" ? "TU Media logo" : "TU Media favicon",
            }),
          }}
          onSelect={async (media) => {
            if (media.type !== "image")
              return { success: false, message: "Choose an image." };
            setDraft((current) => ({
              ...current,
              branding: {
                ...current.branding,
                [mediaTarget]: { url: media.url, alt: media.alt },
              },
            }));
            return {
              success: true,
              message: "Asset selected. Save site settings to publish it.",
            };
          }}
        />
      ) : null}
      <SitePublishingAside pending={pending} result={result} />
    </form>
  );
}
