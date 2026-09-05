import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";
import type { MediaRef } from "@/lib/types/landing";

export type SiteContent = CmsDocumentBase & {
  key: "site";
  seo: SeoFields;
  branding: { logo?: MediaRef; favicon?: MediaRef };
  footer: {
    positioning: string;
    socialLinks: Array<{ id: string; url: string; order: number }>;
    newsletter?: { enabled: boolean; title: string; description: string };
  };
  organisation: { name: string; email: string; phone?: string; address?: string };
};

export type PublicSite = {
  page: "site";
  seo: SeoFields;
  sections: Pick<SiteContent, "branding" | "footer" | "organisation">;
  updatedAt: string;
};
