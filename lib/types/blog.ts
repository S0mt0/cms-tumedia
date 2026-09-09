import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";
export type BlogHero = { eyebrow?: string; title: string; description?: string };
export type BlogPost = CmsDocumentBase & { slug: string; title: string; excerpt: string; content: string; cover?: { url: string; alt: string }; tags: string[]; published: boolean; featured: boolean; publishedAt?: Date };
export type BlogContent = CmsDocumentBase & { key: "blogs"; seo: SeoFields; hero: BlogHero };
export type PublicBlogPost = Omit<BlogPost, "createdAt" | "updatedAt" | "publishedAt"> & { createdAt: string; updatedAt: string; publishedAt?: string };
export type PublicBlogs = { page: "blogs"; seo: SeoFields; hero: BlogHero; items: PublicBlogPost[]; pageNumber: number; total: number; limit: number };
