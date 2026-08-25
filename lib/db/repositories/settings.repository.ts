import type { WithId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";

export type SettingsDocument = {
  key: "integrations";
  googleSheets?: { spreadsheetId: string; updatedAt: Date; updatedBy: string };
  createdAt: Date;
  updatedAt: Date;
};

class SettingsRepository extends BaseRepository<SettingsDocument> {
  protected readonly collectionName = "settings";

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
}

export const settingsRepository = new SettingsRepository();
