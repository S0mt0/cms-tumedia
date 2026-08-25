import Link from "next/link";
import { Button } from "@/components/ui/button";

const copy: Record<string, { title: string; message: string }> = {
  FORBIDDEN: {
    title: "This account is not authorised.",
    message:
      "TU Media CMS is private. Ask an administrator to add your email to the allowlist.",
  },
  unable_to_create_user: {
    title: "This account cannot enter the CMS.",
    message:
      "Only allowlisted administrators can create an account in this private workspace.",
  },
  access_denied: {
    title: "Access was declined.",
    message:
      "The sign-in provider did not complete the request. You can try again or use an email sign-in link.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; code?: string }>;
}) {
  const params = await searchParams;
  const code = params.error ?? params.code ?? "unknown_error";
  const content = copy[code] ?? {
    title: "Something interrupted sign in.",
    message:
      "The sign-in provider returned an error before the CMS could open. Try again, or use a one-time email link.",
  };
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f8fc] p-4">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7">
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#ff3d8d]">
          Sign-in issue
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[#0b0d17]">
          {content.title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {content.message}
        </p>
        <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
          Code: {code}
        </p>
        <Button className="mt-6" render={<Link href="/auth/login" />}>
          Back to sign in
        </Button>
      </section>
    </main>
  );
}
