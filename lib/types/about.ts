import type { CmsDocumentBase, SeoFields } from "@/lib/types/content";
import type { CtaContent, MediaRef } from "@/lib/types/landing";
import type { RichTextDocument } from "@/lib/rich-text";

export type AboutItem = { id: string; text: string; order: number };
export type AboutSections = {
  hero: {
    eyebrow?: string;
    title: string;
    emphasis?: string;
    description?: string;
    supportingCopy?: string;
    cta?: CtaContent;
    background?: MediaRef;
    collage: (MediaRef & { id: string; order: number })[];
  };
  whyWeExist: { eyebrow: string; title: string; body: RichTextDocument };
  perspective: {
    eyebrow: string;
    title: string;
    description: string;
    bridgeEyebrow: string;
    bridgeTitle: string;
    brandsLabel: string;
    creatorsLabel: string;
    brands: AboutItem[];
    creators: AboutItem[];
  };
  difference: {
    eyebrow: string;
    title: string;
    introduction: string;
    cta: CtaContent;
    items: {
      id: string;
      title: string;
      short: string;
      copy: string;
      details: AboutItem[];
      order: number;
    }[];
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: AboutItem[];
    principlesEyebrow: string;
    principles: { id: string; title: string; copy: string; order: number }[];
  };
  globalCapability: {
    eyebrow: string;
    title: string;
    description: string;
    scrollHint: string;
    locations: {
      id: string;
      title: string;
      label: string;
      copy: string;
      image: MediaRef;
      order: number;
    }[];
  };
  audiencePaths: {
    eyebrow: string;
    title: string;
    brand: {
      eyebrow: string;
      copy: string;
      title: string;
      cta: CtaContent;
      supportingCopy: string;
    };
    creator: {
      eyebrow: string;
      copy: string;
      title: string;
      cta: CtaContent;
      supportingCopy: string;
      background: MediaRef;
    };
  };
  closing: {
    workEyebrow: string;
    workTitle: string;
    workDescription: string;
    industries: AboutItem[];
    manifestoEyebrow: string;
    manifestoTitle: string;
    manifestoDescription: string;
    manifestoCta: CtaContent;
    finalTitle: string;
    finalDescription: string;
    primaryCta: CtaContent;
    secondaryCta: CtaContent;
  };
};
export type AboutContent = CmsDocumentBase & {
  key: "about";
  seo: SeoFields;
} & AboutSections;
export type PublicAbout = {
  page: "about";
  seo: SeoFields;
  sections: AboutSections;
  updatedAt: string;
};
