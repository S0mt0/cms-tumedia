import { Spinner } from "@/components/ui/spinner";

export default function DashboardLoading() {
  return <div className="space-y-6 animate-pulse"><div className="h-8 w-48 rounded bg-slate-200" /><div className="h-5 w-[min(100%,34rem)] rounded bg-slate-100" /><div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-40 rounded-2xl border border-slate-200 bg-white p-5"><Spinner className="text-[#7047eb]" /></div>)}</div></div>;
}
