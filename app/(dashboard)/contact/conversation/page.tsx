import { cache } from "react";
import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { contactRepository } from "@/lib/db/repositories/contact.repository";
import type { ContactSections } from "@/lib/types/contact";
import { ConversationEditor } from "./_components/conversation-editor";

const getConversation = cache(async () => JSON.parse(JSON.stringify((await contactRepository.get()).conversation)) as ContactSections["conversation"]);

export default async function ContactConversationPage() {
  const initial = await getConversation();
  return <CmsEditorPageShell eyebrow="Contact page" title="Start a conversation" description="The context and invitation shown beside the brand enquiry form." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Contact", href: "/contact" }, { label: "Start a conversation" }]} previewHref={`${process.env.FRONTEND_BASE_URL ?? "http://localhost:3001"}/contact`}><ConversationEditor initial={initial} /></CmsEditorPageShell>;
}
