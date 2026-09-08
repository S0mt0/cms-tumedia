import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";

export type ContactStep = {
  id: string;
  title: string;
  copy: string;
  order: number;
};

export type ContactSections = {
  hero: {
    eyebrow?: string;
    title: string;
    emphasis?: string;
    description?: string;
    notes: Array<{ id: string; text: string; order: number }>;
  };
  conversation: {
    eyebrow?: string;
    title: string;
    emphasis?: string;
    description?: string;
    creatorPrompt?: string;
    creatorLinkLabel?: string;
  };
  nextSteps: {
    eyebrow?: string;
    title: string;
    emphasis?: string;
    description?: string;
    steps: ContactStep[];
  };
  info: {
    phone?: string;
    email?: string;
    address?: string;
    socialLinks: Array<{ id: string; url: string; order: number }>;
  };
};

export type ContactContent = CmsDocumentBase & {
  key: "contact";
  seo: SeoFields;
} & ContactSections;

export type PublicContact = {
  page: "contact";
  seo: SeoFields;
  sections: ContactSections;
  updatedAt: string;
};

export type ContactSubmissionStatus = "unread" | "read";

export type ContactSubmission = {
  fullName: string;
  email: string;
  company: string;
  website?: string;
  market: string;
  product: string;
  objective: string;
  timeline: string;
  budget?: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactSubmissionListItem = Omit<
  ContactSubmission,
  "createdAt" | "updatedAt"
> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
