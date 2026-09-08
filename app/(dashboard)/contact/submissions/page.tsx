import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { contactSubmissionRepository } from "@/lib/db/repositories/contact.repository";
import type { ContactSubmissionListItem, ContactSubmissionStatus } from "@/lib/types/contact";
import { SubmissionsInbox } from "./_components/submissions-inbox";

function toItem(submission: Awaited<ReturnType<typeof contactSubmissionRepository.list>>["items"][number]): ContactSubmissionListItem {
  const { _id, createdAt, updatedAt, ...item } = submission;
  return { ...item, id: _id.toString(), createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString() };
}

export default async function ContactSubmissionsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; status?: string; sort?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = 10;
  const status = query.status === "read" || query.status === "unread" ? query.status as ContactSubmissionStatus : undefined;
  const sort = query.sort === "oldest" ? "oldest" : "newest";
  const result = await contactSubmissionRepository.list({ page, limit, search: query.search, status, sort });
  const safePage = Math.min(page, Math.max(1, Math.ceil(result.total / limit)));
  const items = safePage === page ? result.items : (await contactSubmissionRepository.list({ page: safePage, limit, search: query.search, status, sort })).items;
  return <CmsEditorPageShell eyebrow="Contact page" title="Submissions" description="Review, filter, and manage enquiries from the public contact form." breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Contact", href: "/contact" }, { label: "Submissions" }]}><SubmissionsInbox items={items.map(toItem)} page={safePage} total={result.total} limit={limit} searchParams={query} /></CmsEditorPageShell>;
}
