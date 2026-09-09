import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { joinRepository } from "@/lib/db/repositories/join.repository";
import type { JoinSections } from "@/lib/types/join";
import { JoinNextStepsEditor } from "./_components/join-next-steps-editor";
const getSteps = cache(async () => JSON.parse(JSON.stringify((await joinRepository.get()).nextSteps)) as JoinSections["nextSteps"]);
export default async function JoinNextStepsPage() { return <CmsEditorPageShell eyebrow="For creators" title="What happens next" description="A clear, ordered creator journey." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "For creators", href: "/join" }, { label: "What happens next" }]}><JoinNextStepsEditor initial={await getSteps()} /></CmsEditorPageShell>; }
