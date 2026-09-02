"use server";

import { isAdminEmail } from "@/lib/auth/allowlist";
import { requireAdminSession } from "@/lib/auth/guards";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { presignUploadSchema } from "@/lib/schemas/media.schema";
import { createPresignedUpload, getR2PublicUrl } from "@/lib/services/r2.service";
import type { AsyncResult } from "@/lib/types/content";
import type { UploadedMediaAsset } from "@/lib/types/media";
import { z } from "zod";

const createMediaAssetSchema = presignUploadSchema.extend({
  key: z.string().trim().min(1).max(500),
  kind: z.enum(["image", "video"]),
  alt: z.string().trim().max(200).optional(),
});

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
    return { error: "Choose a valid image or MP4 video under 100 MB." };

  try {
    const data = await createPresignedUpload(parsed.data);
    return { success: "Upload ready.", data };
  } catch (error) {
    console.error("Could not create a media upload target.", { error });
    return { error: "We could not prepare that upload. Please try again." };
  }
}

export async function createMediaAsset(
  input: unknown
): Promise<AsyncResult<UploadedMediaAsset>> {
  const session = await getAuthorisedAdmin();
  if (!session) return { error: "You are not authorised to save media." };

  const parsed = createMediaAssetSchema.safeParse(input);
  if (!parsed.success) return { error: "The uploaded media details are invalid." };

  const expectedKind = parsed.data.mimeType.startsWith("image/")
    ? "image"
    : "video";
  if (parsed.data.kind !== expectedKind)
    return { error: "The selected media type does not match the uploaded file." };

  try {
    const url = getR2PublicUrl(parsed.data.key);
    const now = new Date();
    const media = await mediaRepository.create({
      ...parsed.data,
      url,
      createdAt: now,
      updatedAt: now,
      createdBy: session.user.id,
    });

    return {
      success: "Media uploaded.",
      data: {
        id: media._id.toString(),
        key: media.key,
        url: media.url,
        kind: media.kind,
        filename: media.filename,
        alt: media.alt,
      },
    };
  } catch (error) {
    console.error("Could not save uploaded media.", { error });
    return { error: "The file uploaded, but we could not save it to the media library." };
  }
}
