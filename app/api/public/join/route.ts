import { NextResponse } from "next/server";
import { assembleJoin } from "@/lib/api/assemblers/join";
import { cacheKeys } from "@/lib/cache/keys";
import { readPublicCache, writePublicCache } from "@/lib/cache/public-content-cache";
import { creatorSubmissionRepository } from "@/lib/db/repositories/join.repository";
import { creatorSubmissionSchema } from "@/lib/schemas/join.schema";
import { appendSheetRow } from "@/lib/services/google-sheets.service";
import type { PublicJoin } from "@/lib/types/join";
import { publicErrorResponse, publicPageResponse } from "@/lib/api/public-response";

export async function GET() {
  try { const key = cacheKeys.page("join"); const cached = await readPublicCache<PublicJoin>(key); const data = cached ?? await assembleJoin(); if (!cached) await writePublicCache(key, data); return publicPageResponse(data); }
  catch { return publicErrorResponse("Creator content is unavailable.", 503, "JOIN_UNAVAILABLE"); }
}

export async function POST(request: Request) {
  try {
    const parsed = creatorSubmissionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: "Please check the application fields.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    const submission = parsed.data;
    await appendSheetRow("creator", [submission.fullName, submission.email, submission.country, submission.niche, submission.platform, submission.languages ?? "", submission.followers, submission.averageViews, submission.topRegion, submission.categories ?? "", submission.about ?? "", submission.primarySocialLink, submission.secondarySocialLink ?? "", submission.mediaKitUrl ?? "", new Date().toISOString()]);
    await creatorSubmissionRepository.create(submission);
    return NextResponse.json({ success: true, message: "Thanks — your application has been sent." }, { status: 201 });
  } catch { return NextResponse.json({ success: false, message: "We could not send your application. Please try again." }, { status: 500 }); }
}
