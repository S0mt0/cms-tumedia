import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { joinRepository } from "@/lib/db/repositories/join.repository";
import type { JoinSections } from "@/lib/types/join";
import { JoinApplicationEditor } from "./_components/join-application-editor";
const getApplication = cache(async () => JSON.parse(JSON.stringify((await joinRepository.get()).application)) as JoinSections["application"]);
export default async function JoinApplicationPage() { const initial = await getApplication(); return <CmsEditorPageShell eyebrow="For creators" title="Application" description="The copy that guides visitors through the creator intake." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "For creators", href: "/join" }, { label: "Application" }]}><JoinApplicationEditor initial={initial} /></CmsEditorPageShell>; }
