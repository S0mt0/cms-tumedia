import Image from "next/image";

import { getEnvironment } from "@/lib/env";

import { LoginForm } from "./_components/login-form";

export const metadata = { title: "Sign in | TU Media CMS" };

export default function LoginPage() {
  const accessRequestEmail = getEnvironment()
    .DEFAULT_ADMIN_EMAILS.split(",")[0]
    ?.trim();

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-4 lg:grid lg:grid-cols-[1.08fr_.92fr] lg:p-0">
      <section className="relative hidden overflow-hidden bg-[#0b0d17] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <Image
          src="/logo-white.png"
          alt="TU Media"
          width={140}
          height={36}
          className="relative h-auto w-32"
        />
        <div className="relative my-auto max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ff9fc7]">
            TU Media CMS
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-.06em]">
            A thoughtful home for the work behind the work.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65">
            Keep the site current without losing the clarity, care, and creative
            edge that makes it recognisably TU Media.
          </p>
        </div>
        <p className="relative text-sm text-white/45">
          Private workspace for allowlisted administrators.
        </p>
      </section>
      <section className="grid min-h-[calc(100vh-2rem)] place-items-center lg:min-h-screen">
        <div className="w-full max-w-md rounded-sm border bg-white p-6 sm:p-9">
          <Image
            src="/logo-black.png"
            alt="TU Media"
            width={128}
            height={32}
            className="h-auto w-28 lg:hidden"
          />
          <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#7047eb]">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[#0b0d17]">
            Sign in to your studio
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use your allowlisted Google account or request a secure one-time
            link.
          </p>
          <div className="mt-8">
            <LoginForm accessRequestEmail={accessRequestEmail} />
          </div>
        </div>
      </section>
    </main>
  );
}
