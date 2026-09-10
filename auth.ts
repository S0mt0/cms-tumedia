import { APIError, type GenericEndpointContext } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { ObjectId } from "mongodb";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";

import { isAdminEmail } from "@/lib/auth/allowlist";
import { getDatabase, getMongoClient } from "@/lib/db/config";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";
import { getEnvironment } from "@/lib/env";
import { mailService } from "@/lib/services/mail.service";

type BetterAuthUserDocument = {
  _id?: ObjectId;
  id: string;
  email: string;
  name: string;
};

async function findAuthenticatedUser(userId: unknown): Promise<BetterAuthUserDocument | null> {
  const normalizedId = String(userId);
  const filters: Array<Record<string, unknown>> = [{ id: normalizedId }];
  if (ObjectId.isValid(normalizedId)) filters.push({ _id: new ObjectId(normalizedId) });
  return getDatabase().collection<BetterAuthUserDocument>("user").findOne({ $or: filters });
}

function requestDetails(context: GenericEndpointContext | null) {
  const headers = context?.headers;
  const forwardedFor = headers?.get("x-forwarded-for");
  return {
    ip:
      forwardedFor?.split(",")[0]?.trim() ||
      headers?.get("x-real-ip") ||
      undefined,
    userAgent: headers?.get("user-agent") || undefined,
  };
}

function deviceFromUserAgent(userAgent?: string): string {
  if (!userAgent) return "Unknown device";
  const platform = /iPhone|iPad|iPod/i.test(userAgent)
    ? "iOS"
    : /Android/i.test(userAgent)
    ? "Android"
    : /Mac OS X/i.test(userAgent)
    ? "macOS"
    : /Windows/i.test(userAgent)
    ? "Windows"
    : /Linux/i.test(userAgent)
    ? "Linux"
    : "Unknown OS";

  const browser = /Edg\//i.test(userAgent)
    ? "Edge"
    : /Chrome\//i.test(userAgent)
    ? "Chrome"
    : /Firefox\//i.test(userAgent)
    ? "Firefox"
    : /Safari\//i.test(userAgent)
    ? "Safari"
    : "Browser";
  return `${platform} · ${browser}`;
}

const environment = getEnvironment();

if (!environment.BETTER_AUTH_SECRET || !environment.BETTER_AUTH_URL) {
  throw new Error(
    "BETTER_AUTH_SECRET and BETTER_AUTH_URL are required to configure authentication."
  );
}

export const auth = betterAuth({
  baseURL: environment.BETTER_AUTH_URL,
  secret: environment.BETTER_AUTH_SECRET,
  database: mongodbAdapter(getDatabase(), { client: getMongoClient() }),
  trustedOrigins: [environment.BETTER_AUTH_URL, environment.BASE_URL].filter(
    (origin): origin is string => Boolean(origin)
  ),
  emailAndPassword: { enabled: false },
  socialProviders:
    environment.GOOGLE_CLIENT_ID && environment.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: environment.GOOGLE_CLIENT_ID,
            clientSecret: environment.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!(await isAdminEmail(user.email))) {
            throw new APIError("FORBIDDEN", { message: "unauthorized" });
          }
        },
      },
    },
    session: {
      create: {
        after: async (session, context) => {
          const user = await findAuthenticatedUser(session.userId);
          if (!user || !(await isAdminEmail(user.email))) return;

          const details = requestDetails(context);
          await adminLogRepository.recordSessionLogin({
            adminId: String(session.userId),
            email: user.email,
            sessionId: String(session.id),
            ...details,
            device: deviceFromUserAgent(details.userAgent),
            loginAt: new Date(),
          });
        },
      },
      delete: {
        after: async (session) => {
          const user = await findAuthenticatedUser(session.userId);
          if (!user) return;
          await adminLogRepository.recordSessionLogout({
            sessionId: String(session.id),
            adminId: String(session.userId),
            email: user.email,
            loginAt:
              "createdAt" in session && session.createdAt instanceof Date
                ? session.createdAt
                : undefined,
          });
        },
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!(await isAdminEmail(email))) {
          throw new APIError("FORBIDDEN", {
            message: "This account is not authorised to access the CMS.",
          });
        }
        const delivery = await mailService.sendMagicLinkEmail({
          to: email,
          url,
        });
        if (delivery.error)
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: delivery.error,
          });
      },
    }),
    nextCookies(),
  ],
});
