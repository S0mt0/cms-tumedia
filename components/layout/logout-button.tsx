"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={signOut}
      className="min-h-11 w-full justify-start px-3 text-slate-700 hover:bg-slate-100"
    >
      Sign out
    </Button>
  );
}
