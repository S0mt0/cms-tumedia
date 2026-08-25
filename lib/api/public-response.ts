import { NextResponse } from "next/server";

import type { SeoFields } from "@/lib/types/content";

export type PublicPageResponse<TSections> = {
  success: true;
  data: { page: string; seo: SeoFields; sections: TSections; updatedAt: string };
};

export type PublicErrorResponse = { success: false; message: string; code?: string };

export function publicPageResponse<TSections>(data: PublicPageResponse<TSections>["data"]): NextResponse<PublicPageResponse<TSections>> {
  return NextResponse.json({ success: true, data });
}

export function publicErrorResponse(message: string, status: number, code?: string): NextResponse<PublicErrorResponse> {
  return NextResponse.json({ success: false, message, ...(code ? { code } : {}) }, { status });
}
