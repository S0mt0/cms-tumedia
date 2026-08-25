import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { z } from "zod";

import { getEnvironment } from "@/lib/env";
import type { presignUploadSchema } from "@/lib/schemas/media.schema";

type PresignUploadInput = z.infer<typeof presignUploadSchema>;

function requiredR2Environment() {
  const environment = getEnvironment();
  const required = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_BASE_URL",
  ] as const;
  if (required.some((key) => !environment[key]))
    throw new Error("Cloudflare R2 is not configured.");
  return environment as typeof environment &
    Required<Pick<typeof environment, (typeof required)[number]>>;
}

export function getR2Client(): S3Client {
  const environment = requiredR2Environment();
  return new S3Client({
    region: "auto",
    endpoint: `https://${environment.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: environment.R2_ACCESS_KEY_ID,
      secretAccessKey: environment.R2_SECRET_ACCESS_KEY,
    },
  });
}

function safeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPresignedUpload(input: PresignUploadInput) {
  const environment = requiredR2Environment();
  const key = `${input.folder}/${crypto.randomUUID()}-${safeFilename(
    input.filename
  )}`;
  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: environment.R2_BUCKET_NAME,
      Key: key,
      ContentType: input.mimeType,
    }),
    { expiresIn: 60 }
  );
  return {
    key,
    uploadUrl,
    publicUrl: `${environment.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`,
  };
}

export async function createPresignedDownload(key: string): Promise<string> {
  const environment = requiredR2Environment();
  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({ Bucket: environment.R2_BUCKET_NAME, Key: key }),
    { expiresIn: 60 }
  );
}

export async function deleteR2Object(key: string): Promise<void> {
  const environment = requiredR2Environment();
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: environment.R2_BUCKET_NAME, Key: key })
  );
}
