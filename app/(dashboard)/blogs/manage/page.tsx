import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { blogPostRepository } from "@/lib/db/repositories/blog.repository";
import { BlogPostList } from "./_components/blog-post-list";

export default async function BlogManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = 12;
  const published =
    query.status === "published"
      ? true
      : query.status === "draft"
      ? false
      : undefined;
  const result = await blogPostRepository.list({
    page,
    limit,
    published,
    search: query.search,
  });
  const safePage = Math.min(page, Math.max(1, Math.ceil(result.total / limit)));
  const items =
    safePage === page
      ? result.items
      : (
          await blogPostRepository.list({
            page: safePage,
            limit,
            published,
            search: query.search,
          })
        ).items;
  const serialised = items.map(
    ({ _id, createdAt, updatedAt, publishedAt, ...item }) => ({
      ...item,
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      publishedAt: publishedAt?.toISOString(),
    })
  );
  return (
    <CmsEditorPageShell
      eyebrow="Blogs"
      title="Manage posts"
      description="Create, find, and edit the stories shown in the public archive."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Blogs", href: "/blogs" },
        { label: "Manage" },
      ]}
    >
      <BlogPostList
        items={serialised}
        page={safePage}
        total={result.total}
        limit={limit}
        searchParams={query}
      />
    </CmsEditorPageShell>
  );
}
