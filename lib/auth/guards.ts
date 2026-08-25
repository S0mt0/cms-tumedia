import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth/allowlist";

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !(await isAdminEmail(session.user.email))) return null;
  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    await auth.api.signOut({ headers: await headers() });
    redirect("/auth/login");
  }
  return session;
}
