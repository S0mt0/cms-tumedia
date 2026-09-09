import { publicErrorResponse, publicPageResponse } from "@/lib/api/public-response";
import { blogContentRepository, blogPostRepository } from "@/lib/db/repositories/blog.repository";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await blogPostRepository.bySlug(slug);
    if (!post || !post.published) return publicErrorResponse("Blog post not found.", 404, "BLOG_NOT_FOUND");
    const { _id, createdAt, updatedAt, publishedAt, ...data } = post;
    void _id;
    const content = await blogContentRepository.get();
    return publicPageResponse({ page: "blog", seo: { title: post.title, description: post.excerpt, ogImage: post.cover?.url }, sections: { post: { ...data, createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString(), publishedAt: publishedAt?.toISOString() } }, updatedAt: content.updatedAt.toISOString() });
  } catch { return publicErrorResponse("Blog post is unavailable.", 503, "BLOG_UNAVAILABLE"); }
}
