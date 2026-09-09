import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type JoinMedia =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string; alt?: string; posterUrl?: string };

export type JoinItem = { id: string; order: number; title: string; copy: string };
export type JoinFaqItem = { id: string; order: number; question: string; answer: string };

export type JoinSections = {
  hero: { eyebrow?: string; title: string; emphasis?: string; description?: string; ctaLabel?: string; media: JoinMedia };
  application: { eyebrow?: string; title: string; emphasis?: string; description?: string; privacyLabel?: string };
  nextSteps: { eyebrow?: string; title: string; emphasis?: string; description?: string; steps: JoinItem[] };
  faq: { eyebrow?: string; title: string; description?: string; items: JoinFaqItem[] };
};

export type JoinContent = CmsDocumentBase & { key: "join"; seo: SeoFields } & JoinSections;
export type PublicJoin = { page: "join"; seo: SeoFields; sections: JoinSections; updatedAt: string };
export type CreatorSubmissionStatus = "unread" | "read";
export type CreatorSubmission = {
  fullName: string; email: string; country: string; niche: string; platform: string; languages?: string;
  followers: string; averageViews: string; topRegion: string; categories?: string; about?: string;
  primarySocialLink: string; secondarySocialLink?: string; mediaKitUrl?: string;
  status: CreatorSubmissionStatus; createdAt: Date; updatedAt: Date;
};
export type CreatorSubmissionListItem = Omit<CreatorSubmission, "createdAt" | "updatedAt"> & { id: string; createdAt: string; updatedAt: string };
