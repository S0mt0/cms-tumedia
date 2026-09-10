import type { Dispatch, SetStateAction } from "react";
import type { SiteContent } from "@/lib/types/site";

export type SiteDraft = Pick<
  SiteContent,
  "seo" | "branding" | "organisation"
>;
export type DraftSetter = Dispatch<SetStateAction<SiteDraft>>;
