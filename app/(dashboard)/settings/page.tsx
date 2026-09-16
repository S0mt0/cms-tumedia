import { CmsPageHeader } from "@/components/common/cms-page-header";
import { ModuleCard } from "@/components/common/module-card";
import { GoogleSheetsSettingsForm } from "./_components/google-sheets-settings-form";
import { MailSenderSettingsForm } from "./_components/mail-sender-settings-form";
import { AccessSettings } from "./_components/access-settings";
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/guards";
import { adminAllowlistRepository } from "@/lib/db/repositories/admin-allowlist.repository";
import { getEnvironment } from "@/lib/env";
import { settingsRepository } from "@/lib/db/repositories/settings.repository";

export default async function SettingsPage() {
  const environment = getEnvironment();
  const [configured, mailSettings, session, allowlist] = await Promise.all([
    settingsRepository.getGoogleSheetsSpreadsheetId(),
    settingsRepository.getMailServiceSettings(),
    requireAdminSession(),
    adminAllowlistRepository.list(),
  ]);
  const environmentEmails = environment.DEFAULT_ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const emails = Array.from(
    new Set([...environmentEmails, ...allowlist.map((item) => item.email)])
  ).sort();
  return (
    <div className="space-y-6">
      <CmsPageHeader
        title="Settings"
        description="Manage CMS access and integration settings."
        actions={<div className="flex flex-wrap gap-2"><Link className="min-h-11 rounded-md border border-[#c5d4cd] px-4 py-2 text-sm font-semibold" href="/settings/logs">Session logs</Link><Link className="min-h-11 rounded-md border border-[#c5d4cd] px-4 py-2 text-sm font-semibold" href="/settings/activity">Activity logs</Link></div>}
      />
      <AccessSettings
        emails={emails}
        currentEmail={session.user.email}
        environmentEmails={environmentEmails}
      />
      <ModuleCard
        title="Google Sheets"
        description="A saved spreadsheet ID overrides the environment fallback for submission syncing."
      >
        <GoogleSheetsSettingsForm
          initialValue={
            configured ?? environment.GOOGLE_SHEETS_SPREADSHEET_ID ?? ""
          }
          environmentFallback={
            !configured && Boolean(environment.GOOGLE_SHEETS_SPREADSHEET_ID)
          }
        />
      </ModuleCard>
      <ModuleCard title="Mail sender" description="Set the name and email address used when the CMS sends email.">
        <MailSenderSettingsForm
          initialName={mailSettings?.senderName ?? environment.SENDER_NAME}
          initialEmail={mailSettings?.mailFrom ?? `${environment.MAIL_FROM}@mail.thetumedia.com`}
        />
      </ModuleCard>
    </div>
  );
}
