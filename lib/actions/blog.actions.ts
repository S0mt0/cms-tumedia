"use server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { blogContentRepository, blogPostRepository } from "@/lib/db/repositories/blog.repository";
import { blogHeroSchema, blogPostSchema } from "@/lib/schemas/blog.schema";
import type { ActionResult } from "@/lib/types/content";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
import { recordCmsActivity } from "@/lib/actions/activity-log";
const slugify=(text:string)=>text.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
function revalidateBlogs(slug?: string) {
  revalidatePath("/blogs");
  revalidatePath("/blogs/hero");
  revalidatePath("/blogs/manage");
  if (slug) revalidatePath(`/blogs/manage/${slug}`);
}

export async function saveBlogHero(input:unknown):Promise<ActionResult>{const session=await requireAdminSession();const parsed=blogHeroSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the hero fields."};await blogContentRepository.updateHero(parsed.data,session.user.id);await invalidateCache(cacheKeys.page("blogs"));void recordCmsActivity(session.user,"updated_content","Blogs / hero");revalidateBlogs();return {success:true,message:"Hero saved."};}
export async function createBlogPost(input:unknown):Promise<ActionResult<{slug:string}>>{const session=await requireAdminSession();const parsed=blogPostSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the post fields."};const slug=slugify(parsed.data.title);if(!slug)return {success:false,message:"Use a title with letters or numbers."};if(await blogPostRepository.bySlug(slug))return {success:false,message:"A post with this title already exists."};const now=new Date();await blogPostRepository.create({...parsed.data,slug,createdAt:now,updatedAt:now,updatedBy:session.user.id,publishedAt:parsed.data.published?now:undefined});await invalidateCache(cacheKeys.page("blogs"));void recordCmsActivity(session.user,"created_blog",parsed.data.title);revalidateBlogs(slug);return {success:true,data:{slug},message:"Post created."};}
export async function updateBlogPost(slug:string,input:unknown):Promise<ActionResult>{const session=await requireAdminSession();const parsed=blogPostSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the post fields."};const existing=await blogPostRepository.bySlug(slug);if(!existing)return {success:false,message:"This post no longer exists."};const publishedAt=parsed.data.published ? existing.publishedAt ?? new Date() : undefined;await blogPostRepository.updateBySlug(slug,{...parsed.data,publishedAt,updatedBy:session.user.id});await invalidateCache(cacheKeys.page("blogs"));await invalidateCache(cacheKeys.blog(slug));void recordCmsActivity(session.user,"updated_blog",parsed.data.title);revalidateBlogs(slug);return {success:true,message:"Post saved."};}
export async function deleteBlogPosts(slugs: string[]): Promise<ActionResult> { const session=await requireAdminSession(); const unique = [...new Set(slugs.filter(Boolean))]; if (!unique.length) return { success: false, message: "Choose at least one post." }; await blogPostRepository.deleteBySlugs(unique); await invalidateCache(cacheKeys.page("blogs")); await Promise.all(unique.map((slug) => invalidateCache(cacheKeys.blog(slug)))); void recordCmsActivity(session.user,"deleted_blog",`${unique.length} post${unique.length===1?"":"s"}`); revalidateBlogs(); unique.forEach((slug) => revalidatePath(`/blogs/manage/${slug}`)); return { success: true, message: `${unique.length} post${unique.length === 1 ? "" : "s"} deleted.` }; }
