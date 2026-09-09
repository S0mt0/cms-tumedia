import { z } from "zod";
const text=(n:number)=>z.string().trim().min(1).max(n);
export const blogPostSchema=z.object({title:text(180),excerpt:text(700),content:text(100_000),cover:z.object({url:text(1000),alt:text(300)}).optional(),tags:z.array(text(60)).max(12),published:z.boolean(),featured:z.boolean()});
export const blogHeroSchema=z.object({eyebrow:z.string().trim().max(100).optional(),title:text(200),description:z.string().trim().max(700).optional()});
