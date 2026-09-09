"use server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { blogContentRepository, blogPostRepository } from "@/lib/db/repositories/blog.repository";
import { blogHeroSchema, blogPostSchema } from "@/lib/schemas/blog.schema";
import type { ActionResult } from "@/lib/types/content";
import { invalidateCache } from "@/lib/cache/invalidation";
import { cacheKeys } from "@/lib/cache/keys";
const slugify=(text:string)=>text.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
function revalidateBlogs(slug?: string) {
  revalidatePath("/blogs");
  revalidatePath("/blogs/hero");
  revalidatePath("/blogs/manage");
  if (slug) revalidatePath(`/blogs/manage/${slug}`);
}

export async function saveBlogHero(input:unknown):Promise<ActionResult>{const session=await requireAdminSession();const parsed=blogHeroSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the hero fields."};await blogContentRepository.updateHero(parsed.data,session.user.id);await invalidateCache(cacheKeys.page("blogs"));revalidateBlogs();return {success:true,message:"Hero saved."};}
export async function createBlogPost(input:unknown):Promise<ActionResult<{slug:string}>>{const session=await requireAdminSession();const parsed=blogPostSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the post fields."};const slug=slugify(parsed.data.title);if(!slug)return {success:false,message:"Use a title with letters or numbers."};if(await blogPostRepository.bySlug(slug))return {success:false,message:"A post with this title already exists."};const now=new Date();await blogPostRepository.create({...parsed.data,slug,createdAt:now,updatedAt:now,updatedBy:session.user.id,publishedAt:parsed.data.published?now:undefined});await invalidateCache(cacheKeys.page("blogs"));revalidateBlogs(slug);return {success:true,data:{slug},message:"Post created."};}
export async function updateBlogPost(slug:string,input:unknown):Promise<ActionResult>{const session=await requireAdminSession();const parsed=blogPostSchema.safeParse(input);if(!parsed.success)return {success:false,message:"Please correct the post fields."};const existing=await blogPostRepository.bySlug(slug);if(!existing)return {success:false,message:"This post no longer exists."};const publishedAt=parsed.data.published ? existing.publishedAt ?? new Date() : undefined;await blogPostRepository.updateBySlug(slug,{...parsed.data,publishedAt,updatedBy:session.user.id});await invalidateCache(cacheKeys.page("blogs"));await invalidateCache(cacheKeys.blog(slug));revalidateBlogs(slug);return {success:true,message:"Post saved."};}
