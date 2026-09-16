import type { WithId } from "mongodb";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { BlogContent, BlogPost } from "@/lib/types/blog";
const heroDefaults = (): BlogContent => { const now = new Date(); return { key: "blogs", createdAt: now, updatedAt: now, seo: { title: "TU Media blog", description: "Useful thinking on creator marketing, technology, and launches." }, hero: { eyebrow: "From the blog", title: "Useful thinking for products worth talking about.", description: "Creator marketing, technology culture, and better launches." } }; };
export class BlogContentRepository extends BaseRepository<BlogContent> { protected readonly collectionName = "blogContent"; async get(): Promise<WithId<BlogContent>> { return (await this.findOne({ key: "blogs" })) ?? this.insertOne(heroDefaults()); } async updateHero(hero: BlogContent["hero"], updatedBy: string) { return this.updateOne({ key: "blogs" }, { $set: { hero, updatedAt: new Date(), updatedBy } }); } }
export class BlogPostRepository extends BaseRepository<BlogPost> {
  protected readonly collectionName = "blogPosts";

  async list({ page, limit, published, featured, search }: { page: number; limit: number; published?: boolean; featured?: boolean; search?: string }) {
    const filter = {
      ...(published === undefined ? {} : { published }),
      ...(featured === undefined ? {} : { featured }),
      ...(search?.trim()
        ? { $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { excerpt: { $regex: search.trim(), $options: "i" } },
          { tags: { $regex: search.trim(), $options: "i" } },
        ] }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.collection().find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      this.collection().countDocuments(filter),
    ]);
    return { items, total };
  }

  async bySlug(slug: string) { return this.findOne({ slug }); }
  async create(post: BlogPost) { return this.insertOne(post); }
  async updateBySlug(slug: string, update: Pick<BlogPost, "title" | "excerpt" | "content" | "cover" | "tags" | "published" | "featured"> & { publishedAt?: Date; updatedBy: string }) {
    return this.updateOne({ slug }, { $set: { ...update, updatedAt: new Date() } });
  }
  async deleteBySlugs(slugs: string[]) {
    if (!slugs.length) return 0;
    const result = await this.collection().deleteMany({ slug: { $in: slugs } });
    return result.deletedCount;
  }
}
export const blogContentRepository = new BlogContentRepository(); export const blogPostRepository = new BlogPostRepository();
