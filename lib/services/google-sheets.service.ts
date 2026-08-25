import { google } from "googleapis";

import { getEnvironment } from "@/lib/env";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";

export type SheetName = "brand" | "creator" | "newsletter";

export async function appendSheetRow(
  sheet: SheetName,
  values: string[]
): Promise<string | undefined> {
  const environment = getEnvironment();
  const spreadsheetId = environment.GOOGLE_SHEETS_SPREADSHEET_ID ?? await settingsRepository.getGoogleSheetsSpreadsheetId();
  if (!spreadsheetId) throw new Error("Google Sheets is not configured.");

  const auth = new google.auth.JWT({
    email: environment.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: environment.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const range =
    sheet === "brand"
      ? environment.GOOGLE_SHEETS_BRAND_RANGE
      : sheet === "creator"
      ? environment.GOOGLE_SHEETS_CREATOR_RANGE
      : environment.GOOGLE_SHEETS_NEWSLETTER_RANGE;

  const response = await google
    .sheets({ version: "v4", auth })
    .spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

  return response.data.updates?.updatedRange ?? undefined;
}
