import {
  BookOpenText,
  FilePenLine,
  FileText,
  Flag,
  GalleryVerticalEnd,
  Globe2,
  Layers3,
  MessageCircleQuestion,
  MessagesSquare,
  Newspaper,
  PhoneCall,
  Route,
  SearchCheck,
  Send,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import { landingSectionDefinitions } from "@/lib/constants/landing-sections";

import type { NavItem } from "./types";

export const pageItems: NavItem[] = [
  { href: "/site", label: "Site", icon: SlidersHorizontal },
  { href: "/legal", label: "Terms & privacy", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export const aboutSectionDefinitions = [
  { path: "hero", label: "Hero" },
  { path: "why-we-exist", label: "Why we exist" },
  { path: "our-perspective", label: "Our perspective" },
  { path: "our-difference", label: "Our difference" },
  { path: "our-story", label: "Our story" },
  { path: "global-capability", label: "Global capability" },
  { path: "audience-paths", label: "Audience paths" },
  { path: "closing", label: "Closing" },
  { path: "seo", label: "SEO" },
] as const;

export const aboutIcons: Record<
  (typeof aboutSectionDefinitions)[number]["path"],
  LucideIcon
> = {
  hero: Sparkles,
  "why-we-exist": Target,
  "our-perspective": Layers3,
  "our-difference": Route,
  "our-story": BookOpenText,
  "global-capability": Globe2,
  "audience-paths": GalleryVerticalEnd,
  closing: Flag,
  seo: SearchCheck,
};

export const contactSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  {
    path: "conversation",
    label: "Start a conversation",
    icon: MessageCircleQuestion,
  },
  { path: "next-steps", label: "What happens next", icon: Route },
  { path: "submissions", label: "Submissions", icon: MessagesSquare },
  { path: "info", label: "Info", icon: PhoneCall },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const joinSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "application", label: "Application", icon: UserRoundPlus },
  { path: "next-steps", label: "What happens next", icon: Route },
  { path: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { path: "submissions", label: "Submissions", icon: MessagesSquare },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const blogSectionDefinitions = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "manage", label: "Manage posts", icon: BookOpenText },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const industriesNavigation = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "introduction", label: "Introduction", icon: Target },
  { path: "manage", label: "Industry directory", icon: Layers3 },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const workNavigation = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "collection", label: "Campaign reels", icon: GalleryVerticalEnd },
  { path: "process", label: "Process", icon: Route },
  { path: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { path: "invitation", label: "Invitation", icon: Flag },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const servicesNavigation = [
  { path: "hero", label: "Hero", icon: Sparkles },
  { path: "overview", label: "Overview", icon: Layers3 },
  { path: "system", label: "Connected system", icon: Route },
  { path: "deep-dives", label: "Deep dives", icon: BookOpenText },
  { path: "process", label: "Process", icon: Target },
  { path: "industries", label: "Industries", icon: Globe2 },
  { path: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { path: "closing", label: "Final invitation", icon: Flag },
  { path: "seo", label: "SEO", icon: SearchCheck },
] as const;
export const landingIcons: Record<string, LucideIcon> = {
  hero: Sparkles,
  positioning: Target,
  "our-approach": Route,
  "creator-network": GalleryVerticalEnd,
  industries: Layers3,
  "selected-work": BookOpenText,
  "why-tu-media": Target,
  "blog-preview": BookOpenText,
  faq: MessageCircleQuestion,
  "final-invitation": Flag,
};

export {
  FilePenLine,
  Layers3,
  BookOpenText,
  Route,
  Send,
  UserRoundPlus,
  Newspaper,
  SearchCheck,
  landingSectionDefinitions,
};
