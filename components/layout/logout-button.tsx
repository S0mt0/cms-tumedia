"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    await authClient.signOut();
    router.replace(`/auth/login?callbackUrl=${pathname}`);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "outline"}
      onClick={signOut}
      className={
        compact
          ? "size-11 p-0 text-[#52605d] hover:bg-white/70 hover:text-[#163a37]"
          : "mt-4 min-h-11 w-full justify-center border-[#c5d4cd] bg-white/60 px-3 font-semibold text-[#173c38] hover:bg-white"
      }
      aria-label={compact ? "Sign out" : undefined}
      title={compact ? "Sign out" : undefined}
    >
      <LogOut className="size-4" aria-hidden />
      {compact ? null : "Sign out"}
    </Button>
  );
}
