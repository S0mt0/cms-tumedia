import { z } from "zod";

const rawEnvironmentSchema = z.object({
  BASE_URL: z.string().min(1),
  FRONTEND_BASE_URL: z.string().min(1),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://localhost:27017/tumedia?replicaSet=rs0"),
  MONGODB_DB: z.string().min(1).default("tumedia"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url().optional(),
  DEFAULT_ADMIN_EMAILS: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  MAIL_FROM: z.string().min(1).optional().default("info"),
  BREVO_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  REDIS_URL: z.url().optional().default("redis://127.0.0.1:6379"),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_BASE_URL: z.string().min(1),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1).optional(),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.email(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
  GOOGLE_SHEETS_BRAND_RANGE: z.string().default("Brand Inquiries!A:M"),
  GOOGLE_SHEETS_CREATOR_RANGE: z.string().default("Creator Applications!A:Q"),
  GOOGLE_SHEETS_NEWSLETTER_RANGE: z
    .string()
    .default("Newsletter Subscribers!A:D"),
});

const environmentSchema = rawEnvironmentSchema.extend({
  BETTER_AUTH_URL: z.url(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function getEnvironment(): Environment {
  const raw = rawEnvironmentSchema.parse(process.env);
  return environmentSchema.parse({
    ...raw,
    BETTER_AUTH_URL: raw.BETTER_AUTH_URL ?? raw.BASE_URL,
  });
}

export function hasEnvironment(...keys: Array<keyof Environment>): boolean {
  const environment = getEnvironment();
  return keys.every((key) => Boolean(environment[key]));
}
