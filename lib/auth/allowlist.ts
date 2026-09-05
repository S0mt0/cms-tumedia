import {
  adminAllowlistRepository,
  normalizeEmail,
} from "@/lib/db/repositories/admin-allowlist.repository";
import { getEnvironment } from "@/lib/env";

function defaultAdminEmails(): string[] {
  return (getEnvironment().DEFAULT_ADMIN_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export async function isAdminEmail(email?: string | null): Promise<boolean> {
  return adminAllowlistRepository.isAllowed(email);
}

export function isEnvironmentAdmin(email?: string | null): boolean {
  return defaultAdminEmails().includes(normalizeEmail(email));
}
