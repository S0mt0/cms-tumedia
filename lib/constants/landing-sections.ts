import type { LandingSections } from "@/lib/types/landing";

export type LandingSectionKey = keyof LandingSections;

type LandingSectionDefinition = {
  key: LandingSectionKey;
  label: string;
  title: string;
  description: string;
};

export const landingSectionDefinitions = [
  {
    key: "hero",
    label: "Hero",
    title: "Hero section",
    description: "The opening statement, calls to action, and background media.",
  },
  {
    key: "positioning",
    label: "Positioning",
    title: "Positioning section",
    description: "The point of view, proof points, and moving topic strip.",
  },
  {
    key: "process",
    label: "Process",
    title: "Process section",
    description: "How a brand brief moves through strategy and execution.",
  },
  {
    key: "creatorFlowCta",
    label: "Creator network",
    title: "Creator network section",
    description: "The invitation for creators to join the TU Media network.",
  },
  {
    key: "industriesPreview",
    label: "Industries",
    title: "Industries preview",
    description: "The industry focus areas introduced on the landing page.",
  },
  {
    key: "videoShowcase",
    label: "Selected work",
    title: "Selected work section",
    description: "The featured campaign video and its supporting invitation.",
  },
  {
    key: "whyTuMedia",
    label: "Why TU Media",
    title: "Why TU Media section",
    description: "The collaboration promise, supporting media, and key points.",
  },
  {
    key: "blogPreview",
    label: "Blog preview",
    title: "Blog preview section",
    description: "The landing-page editorial introduction and post display limit.",
  },
  {
    key: "faq",
    label: "Questions",
    title: "Questions section",
    description: "Frequently asked questions that help visitors decide what to do next.",
  },
  {
    key: "finalCta",
    label: "Final invitation",
    title: "Final invitation section",
    description: "The closing conversion message and reassurance copy.",
  },
] as const satisfies readonly LandingSectionDefinition[];

export function getLandingSectionDefinition(value: string) {
  return landingSectionDefinitions.find((section) => section.key === value);
}
