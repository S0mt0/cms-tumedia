import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import {
  blogContentRepository,
  blogPostRepository,
} from "@/lib/db/repositories/blog.repository";
import type { PublicBlogPost } from "@/lib/types/blog";

const serialise = (
  post: Awaited<ReturnType<typeof blogPostRepository.list>>["items"][number]
): PublicBlogPost => {
  const { _id: _ignoredId, createdAt, updatedAt, publishedAt, ...data } = post;

  void _ignoredId;

  return {
    ...data,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    publishedAt: publishedAt?.toISOString(),
  };
};

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pageNumber = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );
    const featuredOnly = searchParams.get("featured") === "true";
    const search = searchParams.get("search")?.trim() || undefined;
    const limit = 12;
    const [{ seo, hero, updatedAt }, { items, total }] = await Promise.all([
      blogContentRepository.get(),
      blogPostRepository.list({ page: pageNumber, limit, published: true, featured: featuredOnly ? true : undefined, search }),
    ]);
    return publicPageResponse({
      page: "blogs",
      seo,
      sections: { hero, items: items.map(serialise), pageNumber, total, limit },
      updatedAt: updatedAt.toISOString(),
    });
  } catch {
    return publicErrorResponse(
      "Blog content is unavailable.",
      503,
      "BLOGS_UNAVAILABLE"
    );
  }
}
