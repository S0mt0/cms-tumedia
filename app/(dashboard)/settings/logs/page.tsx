import { CmsEditorPageShell } from "@/components/common/cms-editor-page-shell";
import { CmsPagination } from "@/components/common/cms-pagination";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function SettingsLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const requestedPage = Math.max(1, Number(query.page) || 1);
  const limit = 30;
  const initial = await adminLogRepository.listSessionsPage(requestedPage, limit);
  const totalPages = Math.max(1, Math.ceil(initial.total / limit));
  const page = Math.min(requestedPage, totalPages);
  const result =
    page === requestedPage
      ? initial
    : await adminLogRepository.listSessionsPage(page, limit);

  return (
    <CmsEditorPageShell
      eyebrow="Settings"
      title="Authentication logs"
      description="A paginated record of administrator sessions, including login, logout, device, and IP details."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Authentication logs" },
      ]}
    >
      <section className="overflow-hidden rounded-xl border border-[#c5d4cd] bg-white">
        <div className="border-b border-[#d7e1dc] px-5 py-4">
          <h2 className="font-bold text-[#173c38]">Session activity</h2>
          <p className="mt-1 text-sm text-[#61746d]">30 sessions per page, newest logins first.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f3f7f5] text-xs font-bold uppercase tracking-[0.08em] text-[#52605d]">
              <tr>
                <th className="px-5 py-3">Administrator</th>
                <th className="px-5 py-3">IP address</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Login time</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Logout time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e9e5]">
              {result.items.length ? (
                result.items.map((entry) => (
                  <tr
                    key={entry.id}
                    className="align-top text-[#314945]"
                  >
                    <td className="px-5 py-4 font-semibold">{entry.email}</td>
                    <td className="px-5 py-4 font-mono text-xs">{entry.ip ?? "Unavailable"}</td>
                    <td className="px-5 py-4">{entry.device}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {formatDate(entry.loginAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={entry.isActive ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"}>
                        {entry.isActive ? "Active" : "Signed out"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[#52605d]">
                      {entry.logoutAt ? formatDate(entry.logoutAt) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#61746d]"
                  >
                    No administrator sessions have been recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4">
          <CmsPagination
            pathname="/settings/logs"
            searchParams={query}
            page={page}
            total={result.total}
            limit={limit}
            itemName="logs"
          />
        </div>
      </section>
    </CmsEditorPageShell>
  );
}
