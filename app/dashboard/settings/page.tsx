import { CmsPageHeader } from "@/components/common/cms-page-header";
import { ModuleCard } from "@/components/common/module-card";
import { GoogleSheetsSettingsForm } from "./_components/google-sheets-settings-form";
import { getEnvironment } from "@/lib/env";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";

export default async function SettingsPage() {
  const environment = getEnvironment();
  const configured = await settingsRepository.getGoogleSheetsSpreadsheetId();
  return <div className="space-y-6"><CmsPageHeader title="Settings" description="Manage safe CMS integration settings. Credentials remain environment-only." /><ModuleCard title="Google Sheets" description="The environment ID takes precedence. Otherwise, the saved spreadsheet ID is used for submission syncing."><GoogleSheetsSettingsForm initialValue={environment.GOOGLE_SHEETS_SPREADSHEET_ID ?? configured ?? ""} environmentManaged={Boolean(environment.GOOGLE_SHEETS_SPREADSHEET_ID)} /></ModuleCard></div>;
}
