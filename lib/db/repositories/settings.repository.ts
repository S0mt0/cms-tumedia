import type { WithId } from "mongodb";

import { getRedisClient } from "@/lib/db/redis-client";
import { BaseRepository } from "@/lib/db/repositories/base.repository";

export type MailServiceSettings = {
  senderName: string;
  mailFrom: string;
  updatedAt: Date;
  updatedBy: string;
};

export type SettingsDocument = {
  key: "integrations";
  googleSheets?: { spreadsheetId: string; updatedAt: Date; updatedBy: string };
  mailService?: MailServiceSettings;
  createdAt: Date;
  updatedAt: Date;
};

class SettingsRepository extends BaseRepository<SettingsDocument> {
  protected readonly collectionName = "settings";
  private readonly mailServiceCacheKey = "tu-media-cms:v1:settings:mail-service";
  private readonly mailServiceCacheTtlSeconds = 365 * 24 * 60 * 60;

  async getIntegrations(): Promise<WithId<SettingsDocument> | null> {
    return this.findOne({ key: "integrations" });
  }

  async getGoogleSheetsSpreadsheetId(): Promise<string | undefined> {
    return (await this.getIntegrations())?.googleSheets?.spreadsheetId;
  }

  async setGoogleSheetsSpreadsheetId(spreadsheetId: string, updatedBy: string): Promise<WithId<SettingsDocument>> {
    const now = new Date();
    const updated = await this.updateOne(
      { key: "integrations" },
      { $set: { googleSheets: { spreadsheetId, updatedAt: now, updatedBy }, updatedAt: now } },
    );
    return updated ?? this.insertOne({ key: "integrations", googleSheets: { spreadsheetId, updatedAt: now, updatedBy }, createdAt: now, updatedAt: now });
  }

  async getMailServiceSettings(): Promise<MailServiceSettings | undefined> {
    try {
      const redis = await getRedisClient();
      const cached = redis
        ? await redis.get<MailServiceSettings>(this.mailServiceCacheKey)
        : null;

      if (cached?.senderName && cached.mailFrom) return cached;
    } catch (error) {
      console.error("Mail service settings cache read failed", { error });
    }

    const settings = (await this.getIntegrations())?.mailService;
    if (!settings) return undefined;

    try {
      const redis = await getRedisClient();
      if (redis) {
        await redis.set(this.mailServiceCacheKey, settings, {
          ex: this.mailServiceCacheTtlSeconds,
        });
      }
    } catch (error) {
      console.error("Mail service settings cache write failed", { error });
    }

    return settings;
  }

  async setMailServiceSettings(
    input: Pick<MailServiceSettings, "senderName" | "mailFrom">,
    updatedBy: string
  ): Promise<WithId<SettingsDocument>> {
    const now = new Date();
    const mailService: MailServiceSettings = { ...input, updatedAt: now, updatedBy };
    const updated = await this.updateOne(
      { key: "integrations" },
      { $set: { mailService, updatedAt: now } }
    );
    const document =
      updated ??
      (await this.insertOne({
        key: "integrations",
        mailService,
        createdAt: now,
        updatedAt: now,
      }));

    try {
      const redis = await getRedisClient();
      if (redis) {
        await redis.set(this.mailServiceCacheKey, mailService, {
          ex: this.mailServiceCacheTtlSeconds,
        });
      }
    } catch (error) {
      console.error("Mail service settings cache refresh failed", { error });
    }

    return document;
  }
}

export const settingsRepository = new SettingsRepository();
