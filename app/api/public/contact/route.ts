import { NextResponse } from "next/server";

import { assembleContact } from "@/lib/api/assemblers/contact";
import {
  publicErrorResponse,
  publicPageResponse,
} from "@/lib/api/public-response";
import { cacheKeys } from "@/lib/cache/keys";
import {
  readPublicCache,
  writePublicCache,
} from "@/lib/cache/public-content-cache";
import { contactSubmissionRepository } from "@/lib/db/repositories/contact.repository";
import { contactSubmissionSchema } from "@/lib/schemas/contact.schema";
import { appendSheetRow } from "@/lib/services/google-sheets.service";
import type { PublicContact } from "@/lib/types/contact";

export async function GET() {
  try {
    const key = cacheKeys.page("contact");
    const cached = await readPublicCache<PublicContact>(key);
    const data = cached ?? (await assembleContact());
    if (!cached) await writePublicCache(key, data);
    return publicPageResponse(data);
  } catch {
    return publicErrorResponse(
      "Contact content is unavailable.",
      503,
      "CONTACT_UNAVAILABLE"
    );
  }
}

export async function POST(request: Request) {
  try {
    const parsed = contactSubmissionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the enquiry fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const submission = parsed.data;
    await appendSheetRow("contact", [
      submission.fullName,
      submission.email,
      submission.company,
      submission.website ?? "",
      submission.market,
      submission.product,
      submission.objective,
      submission.timeline,
      submission.budget ?? "",
      submission.message,
      new Date().toISOString(),
    ]);

    await contactSubmissionRepository.create(submission);

    return NextResponse.json(
      { success: true, message: "Thanks — your enquiry has been sent." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "We could not send your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
