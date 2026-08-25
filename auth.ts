import { APIError, type GenericEndpointContext } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";

import { isAdminEmail } from "@/lib/auth/allowlist";
import { getDatabase, getMongoClient } from "@/lib/db/config";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";
import { getEnvironment } from "@/lib/env";
import { mailService } from "@/lib/services/mail.service";

type BetterAuthUserDocument = {
  id: string;
  email: string;
  name: string;
};

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
          const user = await getDatabase()
            .collection<BetterAuthUserDocument>("user")
            .findOne({ id: session.userId });
          if (!user || !(await isAdminEmail(user.email))) return;

          await adminLogRepository.record({
            event: "login",
            adminId: session.userId,
            email: user.email,
            sessionId: session.id,
            ...requestDetails(context),
            createdAt: new Date(),
          });
        },
      },
      delete: {
        after: async (session) => {
          await adminLogRepository.record({
            event: "logout",
            adminId: session.userId,
            sessionId: session.id,
            createdAt: new Date(),
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
