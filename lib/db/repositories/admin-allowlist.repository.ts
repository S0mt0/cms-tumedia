import type { Filter, WithId } from "mongodb";

import { getRedisClient } from "@/lib/db/redis-client";
import { BaseRepository } from "@/lib/db/repositories/base.repository";
import { getEnvironment } from "@/lib/env";

export type AdminAllowlistDocument = {
  email: string;
  createdAt: Date;
  createdBy?: string;
};

export function normalizeEmail(email?: string | null): string {
  return email?.trim().toLowerCase() ?? "";
}

class AdminAllowlistRepository extends BaseRepository<AdminAllowlistDocument> {
  protected readonly collectionName = "adminAllowlist";

  private cachedEmails: string[] | null = null;
  private cachedAt = 0;
  private environmentSeeded = false;
  private readonly cacheKey = "tu-media-cms:v1:auth:allowlist";
  private readonly memoryCacheTtlMs = 60_000;
  private readonly redisCacheTtlSeconds = 7 * 24 * 60 * 60;

  private environmentEmails(): string[] {
    return (getEnvironment().DEFAULT_ADMIN_EMAILS ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean);
  }

  private refreshMemoryCache(emails: string[]): string[] {
    this.cachedEmails = Array.from(
      new Set(emails.map(normalizeEmail).filter(Boolean)),
    ).sort();
    this.cachedAt = Date.now();
    return this.cachedEmails;
  }

  private async seedEnvironmentAdmins(): Promise<void> {
    if (this.environmentSeeded) return;
    await Promise.all(this.environmentEmails().map(async (email) => {
      const filter: Filter<AdminAllowlistDocument> = { email };
      if (!(await this.findOne(filter))) {
        await this.insertOne({ email, createdAt: new Date() });
      }
    }));
    this.environmentSeeded = true;
  }

  private async refreshEmailCache(): Promise<string[]> {
    await this.seedEnvironmentAdmins();
    const entries = await this.collection().find({}).sort({ email: 1 }).toArray();
    const emails = this.refreshMemoryCache([
      ...this.environmentEmails(),
      ...entries.map((entry) => entry.email),
    ]);

    try {
      const redis = await getRedisClient();
      if (redis) await redis.set(this.cacheKey, emails, { ex: this.redisCacheTtlSeconds });
    } catch (error) {
      console.error("Admin allowlist cache write failed", { error });
    }

    return emails;
  }

  private async getEmails(): Promise<string[]> {
    await this.seedEnvironmentAdmins();
    try {
      const redis = await getRedisClient();
      const cached = redis ? await redis.get<string[]>(this.cacheKey) : null;
      if (Array.isArray(cached)) {
        return this.refreshMemoryCache([...this.environmentEmails(), ...cached]);
      }
    } catch (error) {
      console.error("Admin allowlist cache read failed", { error });
    }

    if (this.cachedEmails && Date.now() - this.cachedAt < this.memoryCacheTtlMs) {
      return this.cachedEmails;
    }

    return this.refreshEmailCache();
  }

  async isAllowed(email?: string | null): Promise<boolean> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return false;
    return (await this.getEmails()).includes(normalizedEmail);
  }

  async list(): Promise<Array<WithId<AdminAllowlistDocument>>> {
    await this.refreshEmailCache();
    return this.collection().find({}).sort({ email: 1 }).toArray();
  }

  async add(email: string, createdBy?: string): Promise<WithId<AdminAllowlistDocument>> {
    const normalizedEmail = normalizeEmail(email);
    const existing = await this.findOne({ email: normalizedEmail });
    if (existing) {
      await this.refreshEmailCache();
      return existing;
    }

    const created = await this.insertOne({
      email: normalizedEmail,
      createdAt: new Date(),
      createdBy,
    });
    await this.refreshEmailCache();
    return created;
  }

  async remove(email: string): Promise<void> {
    await this.deleteOne({ email: normalizeEmail(email) });
    await this.refreshEmailCache();
  }
}

export const adminAllowlistRepository = new AdminAllowlistRepository();
