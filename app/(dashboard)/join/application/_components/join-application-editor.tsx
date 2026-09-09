"use client";
import { LabeledInput } from "@/components/forms/labeled-input";
import { JoinCopyFields } from "../../_components/join-copy-fields";
import { JoinSectionEditor } from "../../_components/join-section-editor";
import type { JoinSections } from "@/lib/types/join";
export function JoinApplicationEditor({ initial }: { initial: JoinSections["application"] }) { return <JoinSectionEditor section="application" initial={initial} title="Application introduction" description="Set the guidance shown beside the creator application.">{({ value, readOnly, onChange }) => <JoinCopyFields idPrefix="join-application" value={value} readOnly={readOnly} onChange={(patch) => onChange({ ...value, ...patch })} afterTitle={<LabeledInput id="join-privacy-label" label="Privacy link label" readOnly={readOnly} value={value.privacyLabel ?? ""} onChange={(privacyLabel) => onChange({ ...value, privacyLabel: privacyLabel || undefined })} />} />}</JoinSectionEditor>; }
