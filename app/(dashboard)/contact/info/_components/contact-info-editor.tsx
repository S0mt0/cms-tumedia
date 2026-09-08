"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { SortableDndContainer } from "@/components/common/sortable-dnd-container";
import { LabeledInput } from "@/components/forms/labeled-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactSections } from "@/lib/types/contact";
import { normaliseOrder } from "@/lib/utils";
import { ContactSectionEditor } from "../../_components/contact-section-editor";

const socialPlatforms = [
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "facebook",
  "x",
  "threads",
  "pinterest",
  "discord",
  "website",
] as const;

export function ContactInfoEditor({
  initial,
}: {
  initial: ContactSections["info"];
}) {
  return (
    <ContactSectionEditor
      section="info"
      initial={initial}
      title="Platform contact information"
      description="All fields are optional. Add social handles and the public site will create the correct link."
    >
      {({ value, readOnly, onChange }) => (
        <InfoFields value={value} readOnly={readOnly} onChange={onChange} />
      )}
    </ContactSectionEditor>
  );
}

function InfoFields({
  value,
  readOnly,
  onChange,
}: {
  value: ContactSections["info"];
  readOnly: boolean;
  onChange: (next: ContactSections["info"]) => void;
}) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const update = (patch: Partial<ContactSections["info"]>) =>
    onChange({ ...value, ...patch });
  const selectedPlatforms = new Set(value.socialLinks.map((link) => link.id));

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <div className="grid gap-5 md:grid-cols-2">
          <LabeledInput
            id="contact-info-email"
            label="Email"
            readOnly={readOnly}
            value={value.email ?? ""}
            onChange={(email) => update({ email: email || undefined })}
          />
          <LabeledInput
            id="contact-info-phone"
            label="Phone"
            readOnly={readOnly}
            value={value.phone ?? ""}
            onChange={(phone) => update({ phone: phone || undefined })}
          />
          <div className="md:col-span-2">
            <LabeledInput
              id="contact-info-address"
              label="Address"
              readOnly={readOnly}
              value={value.address ?? ""}
              onChange={(address) => update({ address: address || undefined })}
            />
          </div>
        </div>
      </section>

      <section className="rounded-md border border-[#c5d4cd] bg-[#f8fbf9] p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-[#d7e1dc] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold text-[#163a37]">Social links</h3>
            <p className="mt-1 text-sm text-[#61746d]">
              Choose the platform, then enter its handle or paste the full URL.
            </p>
          </div>
          <Button
            disabled={
              readOnly || value.socialLinks.length >= socialPlatforms.length
            }
            size="sm"
            type="button"
            variant="outline"
            onClick={() => {
              const platform = socialPlatforms.find(
                (id) => !selectedPlatforms.has(id)
              );
              if (!platform) return;
              update({
                socialLinks: [
                  ...value.socialLinks,
                  { id: platform, url: "", order: value.socialLinks.length },
                ],
              });
            }}
          >
            <Plus /> Add social
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <SortableDndContainer
            disabled={readOnly}
            items={value.socialLinks}
            sortableItems
            onReorder={(socialLinks) =>
              update({ socialLinks: normaliseOrder(socialLinks) })
            }
          >
            {(social) => (
              <div className="flex flex-col gap-2 rounded-sm border border-[#d7e1dc] bg-white p-3 sm:flex-row sm:items-end">
                <GripVertical className="mb-2 size-4 shrink-0 cursor-grab text-[#8ba098]" />
                <div className="shrink-0 sm:w-36">
                  <label
                    className="text-sm font-medium"
                    htmlFor={`contact-social-${social.id}-platform`}
                  >
                    Platform
                  </label>
                  <Select
                    disabled={readOnly}
                    value={social.id}
                    onValueChange={(id) =>
                      update({
                        socialLinks: value.socialLinks.map((link) =>
                          link.id === social.id
                            ? { ...link, id: id ?? link.id }
                            : link
                        ),
                      })
                    }
                  >
                    <SelectTrigger
                      className="mt-2 h-10"
                      id={`contact-social-${social.id}-platform`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map((platform) => (
                        <SelectItem
                          disabled={
                            platform !== social.id &&
                            selectedPlatforms.has(platform)
                          }
                          key={platform}
                          value={platform}
                        >
                          {platform === "x"
                            ? "X"
                            : platform[0].toUpperCase() + platform.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-0 flex-1">
                  <LabeledInput
                    id={`contact-social-${social.id}-handle`}
                    label="Handle or URL"
                    readOnly={readOnly}
                    value={social.url}
                    onChange={(url) =>
                      update({
                        socialLinks: value.socialLinks.map((link) =>
                          link.id === social.id ? { ...link, url } : link
                        ),
                      })
                    }
                  />
                </div>
                <Button
                  aria-label={`Delete ${social.id}`}
                  className="shrink-0 text-[#a55353]"
                  disabled={readOnly}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirming(social.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </SortableDndContainer>
        </div>
      </section>

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove social link?</AlertDialogTitle>
            <AlertDialogDescription>
              This only changes the draft until you save the section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirming) {
                  update({
                    socialLinks: normaliseOrder(
                      value.socialLinks.filter((link) => link.id !== confirming)
                    ),
                  });
                }
                setConfirming(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
