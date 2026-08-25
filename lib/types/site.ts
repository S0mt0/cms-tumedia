import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type SiteContent = CmsDocumentBase & {
  key: "site";
  seo: SeoFields;
  navigation: {
    servicesLabel: string;
    industriesLabel: string;
    projectsLabel: string;
    blogsLabel: string;
    aboutLabel: string;
    creatorsLabel: string;
    contactLabel: string;
  };
  footer: {
    positioning: string;
    contactEmail: string;
    socialLinks: Array<{ id: string; label: string; url: string; order: number }>;
    newsletter?: { enabled: boolean; title: string; description: string };
  };
  organisation: { name: string; email: string };
};

export type PublicSite = {
  page: "site";
  seo: SeoFields;
  sections: Pick<SiteContent, "navigation" | "footer" | "organisation">;
  updatedAt: string;
};
