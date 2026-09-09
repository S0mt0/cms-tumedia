import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { joinRepository } from "@/lib/db/repositories/join.repository";
import type { JoinSections } from "@/lib/types/join";
import { JoinFaqEditor } from "./_components/join-faq-editor";
const getFaq = cache(async () => JSON.parse(JSON.stringify((await joinRepository.get()).faq)) as JoinSections["faq"]);
export default async function JoinFaqPage() { return <CmsEditorPageShell eyebrow="For creators" title="FAQ" description="Questions and answers shown below the application." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "For creators", href: "/join" }, { label: "FAQ" }]}><JoinFaqEditor initial={await getFaq()} /></CmsEditorPageShell>; }
