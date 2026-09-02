import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f8fc] p-6">
      <div className="flex items-center gap-3 rounded-sm border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600">
        <Spinner className="size-5 text-[#7047eb]" /> Loading your workspace…
      </div>
    </main>
  );
}
