"use server";

import { isAdminEmail } from "@/lib/auth/allowlist";
import { requireAdminSession } from "@/lib/auth/guards";
import { presignUploadSchema } from "@/lib/schemas/media.schema";
import { createPresignedUpload } from "@/lib/services/r2.service";
import type { AsyncResult } from "@/lib/types/content";

async function getAuthorisedAdmin() {
  const session = await requireAdminSession();
  if (!(await isAdminEmail(session.user.email))) return null;
  return session;
}

export async function createMediaUploadTarget(
  input: unknown
): Promise<
  AsyncResult<{ key: string; uploadUrl: string; publicUrl: string }>
> {
  const session = await getAuthorisedAdmin();
  if (!session) return { error: "You are not authorised to upload media." };

  const parsed = presignUploadSchema.safeParse(input);
  if (!parsed.success)
    return { error: "Choose a valid image or MP4 video under 20 MB." };

  try {
    const data = await createPresignedUpload(parsed.data);
    return { success: "Upload ready.", data };
  } catch (error) {
    console.error("Could not create a media upload target.", { error });
    return { error: "We could not prepare that upload. Please try again." };
  }
}
