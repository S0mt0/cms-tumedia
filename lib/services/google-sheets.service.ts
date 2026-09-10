import { google } from "googleapis";

import { getEnvironment } from "@/lib/env";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";
import type { ContactSubmission } from "@/lib/types/contact";
import type { CreatorSubmission } from "@/lib/types/join";

export type SheetName = "brand" | "creator" | "newsletter" | "contact";

const contactHeaders = [
  "Full name",
  "Email",
  "Company",
  "Website",
  "Market",
  "Product or category",
  "Campaign objective",
  "Target timeline",
  "Indicative budget",
  "Message",
  "Submitted at",
];
const creatorHeaders = [
  "Full name",
  "Email",
  "Country",
  "Content niche",
  "Primary platform",
  "Languages",
  "Followers or subscribers",
  "Average views",
  "Top engagement region",
  "Collaboration categories",
  "About their content",
  "Main social profile",
  "Additional social profile",
  "Media kit URL",
  "Submitted at",
];

function getWorksheetTitle(range: string): string {
  const [reference] = range.split("!");
  if (!reference)
    throw new Error("Google Sheets range must include a worksheet name.");

  const title = reference.trim();
  if (title.startsWith("'") && title.endsWith("'")) {
    return title.slice(1, -1).replaceAll("''", "'");
  }

  return title;
}

function worksheetRange(title: string, cells: string): string {
  return `'${title.replaceAll("'", "''")}'!${cells}`;
}

type Worksheet = { sheetId: number; title: string };

async function getWorksheets(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
): Promise<Worksheet[]> {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });

  return (metadata.data.sheets ?? []).flatMap((sheet) => {
    const sheetId = sheet.properties?.sheetId;
    const title = sheet.properties?.title;
    return sheetId == null || !title ? [] : [{ sheetId, title }];
  });
}

async function getWorksheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  title: string
): Promise<Worksheet | undefined> {
  return (await getWorksheets(sheets, spreadsheetId)).find(
    (sheet) => sheet.title === title
  );
}

async function ensureWorksheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  range: string
): Promise<void> {
  const title = getWorksheetTitle(range);
  if (await getWorksheet(sheets, spreadsheetId, title)) return;

  const defaultSheet = (await getWorksheets(sheets, spreadsheetId)).find(
    (sheet) => sheet.title === "Sheet 1" || sheet.title === "Sheet1"
  );
  if (defaultSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: defaultSheet.sheetId, title },
              fields: "title",
            },
          },
        ],
      },
    });
    return;
  }

  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    });
  } catch (error) {
    // A concurrent request may have created the same tab. Preserve real API
    // errors such as missing edit permission or an invalid spreadsheet ID.
    if (!(await getWorksheet(sheets, spreadsheetId, title))) throw error;
  }
}

async function ensureContactHeaders(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  range: string
): Promise<void> {
  const title = getWorksheetTitle(range);
  const headerRange = worksheetRange(title, "A1:K1");
  const current = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });
  const firstRow = current.data.values?.[0] ?? [];

  if (firstRow.join("|") !== contactHeaders.join("|")) {
    if (firstRow.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId: await getWorksheetId(sheets, spreadsheetId, title),
                  dimension: "ROWS",
                  startIndex: 0,
                  endIndex: 1,
                },
                inheritFromBefore: false,
              },
            },
          ],
        },
      });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [contactHeaders] },
    });
  }

  const sheetId = await getWorksheetId(sheets, spreadsheetId, title);
  const columnWidths = [170, 220, 180, 240, 180, 220, 260, 170, 180, 440, 190];
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: contactHeaders.length,
            },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: "userEnteredFormat.textFormat.bold",
          },
        },
        ...columnWidths.map((pixelSize, index) => ({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS" as const,
              startIndex: index,
              endIndex: index + 1,
            },
            properties: { pixelSize },
            fields: "pixelSize",
          },
        })),
      ],
    },
  });
}

async function ensureCreatorHeaders(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  range: string
): Promise<void> {
  const title = getWorksheetTitle(range);
  const headerRange = worksheetRange(title, "A1:O1");
  const firstRow =
    (
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: headerRange,
      })
    ).data.values?.[0] ?? [];
  if (firstRow.join("|") !== creatorHeaders.join("|")) {
    if (firstRow.length > 0)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId: await getWorksheetId(sheets, spreadsheetId, title),
                  dimension: "ROWS",
                  startIndex: 0,
                  endIndex: 1,
                },
                inheritFromBefore: false,
              },
            },
          ],
        },
      });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [creatorHeaders] },
    });
  }
  const sheetId = await getWorksheetId(sheets, spreadsheetId, title);
  const widths = [
    170, 220, 160, 200, 170, 190, 170, 150, 190, 250, 420, 280, 280, 280, 190,
  ];
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: creatorHeaders.length,
            },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: "userEnteredFormat.textFormat.bold",
          },
        },
        ...widths.map((pixelSize, index) => ({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS" as const,
              startIndex: index,
              endIndex: index + 1,
            },
            properties: { pixelSize },
            fields: "pixelSize",
          },
        })),
      ],
    },
  });
}

async function getWorksheetId(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  title: string
): Promise<number> {
  const sheet = await getWorksheet(sheets, spreadsheetId, title);
  if (!sheet) {
    throw new Error(`Worksheet \"${title}\" was not found.`);
  }
  return sheet.sheetId;
}

async function getConfiguredSheet(sheet: SheetName) {
  const environment = getEnvironment();
  const spreadsheetId =
    (await settingsRepository.getGoogleSheetsSpreadsheetId()) ??
    environment.GOOGLE_SHEETS_SPREADSHEET_ID;
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
      : sheet === "newsletter"
      ? environment.GOOGLE_SHEETS_NEWSLETTER_RANGE
      : environment.GOOGLE_SHEETS_CONTACT_RANGE;
  return {
    sheets: google.sheets({ version: "v4", auth }),
    spreadsheetId,
    range,
  };
}

export async function appendSheetRow(
  sheet: SheetName,
  values: string[]
): Promise<string | undefined> {
  const { sheets, spreadsheetId, range } = await getConfiguredSheet(sheet);
  await ensureWorksheet(sheets, spreadsheetId, range);
  if (sheet === "contact") {
    await ensureContactHeaders(sheets, spreadsheetId, range);
  } else if (sheet === "creator") {
    await ensureCreatorHeaders(sheets, spreadsheetId, range);
  }

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });

  return response.data.updates?.updatedRange ?? undefined;
}

function submissionValues(submission: ContactSubmission): string[] {
  return [
    submission.fullName,
    submission.email,
    submission.company,
    submission.website ?? "",
    submission.market,
    submission.product,
    submission.objective,
    submission.timeline,
    submission.budget ?? "",
    submission.message,
    submission.createdAt.toISOString(),
  ];
}

export async function syncContactSheetRows(
  submissions: ContactSubmission[]
): Promise<number> {
  const { sheets, spreadsheetId, range } = await getConfiguredSheet("contact");
  const title = getWorksheetTitle(range);
  await ensureWorksheet(sheets, spreadsheetId, range);
  await ensureContactHeaders(sheets, spreadsheetId, range);
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: worksheetRange(title, "A2:K"),
  });
  if (submissions.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: worksheetRange(title, "A2:K"),
      valueInputOption: "USER_ENTERED",
      requestBody: { values: submissions.map(submissionValues) },
    });
  }
  return submissions.length;
}

function creatorSubmissionValues(submission: CreatorSubmission): string[] {
  return [
    submission.fullName,
    submission.email,
    submission.country,
    submission.niche,
    submission.platform,
    submission.languages ?? "",
    submission.followers,
    submission.averageViews,
    submission.topRegion,
    submission.categories ?? "",
    submission.about ?? "",
    submission.primarySocialLink,
    submission.secondarySocialLink ?? "",
    submission.mediaKitUrl ?? "",
    submission.createdAt.toISOString(),
  ];
}

export async function syncCreatorSheetRows(
  submissions: CreatorSubmission[]
): Promise<number> {
  const { sheets, spreadsheetId, range } = await getConfiguredSheet("creator");
  const title = getWorksheetTitle(range);
  await ensureWorksheet(sheets, spreadsheetId, range);
  await ensureCreatorHeaders(sheets, spreadsheetId, range);
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: worksheetRange(title, "A2:O"),
  });
  if (submissions.length)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: worksheetRange(title, "A2:O"),
      valueInputOption: "USER_ENTERED",
      requestBody: { values: submissions.map(creatorSubmissionValues) },
    });
  return submissions.length;
}
