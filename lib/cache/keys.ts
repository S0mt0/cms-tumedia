const prefix = "tu-media-cms:v1";

export const cacheKeys = {
  site: () => `${prefix}:site`,
  page: (
    page:
      | "landing"
      | "about"
      | "services"
      | "industries"
      | "projects"
      | "blogs"
      | "contact"
      | "join"
      | "privacy"
      | "terms"
  ) => `${prefix}:page:${page}`,
  project: (slug: string) => `${prefix}:project:${slug}`,
  blog: (slug: string) => `${prefix}:blog:${slug}`,
  allowlist: () => `${prefix}:auth:allowlist`,
} as const;
