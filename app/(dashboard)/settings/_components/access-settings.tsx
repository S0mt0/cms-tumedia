"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { notifyActionResult } from "@/components/common/action-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { addAllowedAdmin, deleteOwnAccount, removeAllowedAdmin } from "@/lib/actions/settings.actions";
import { AllowedAdminsCard } from "./allowed-admins-card";
import { DeleteAccountCard } from "./delete-account-card";

export function AccessSettings({ emails, currentEmail, environmentEmails }: { emails: string[]; currentEmail: string; environmentEmails: string[] }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [pending, startTransition] = useTransition(); const [removing, setRemoving] = useState<string | null>(null); const [deleting, setDeleting] = useState(false);
  const add = () => startTransition(async () => { const result = await addAllowedAdmin({ email }); notifyActionResult(result); if (result.success) setEmail(""); });
  const remove = () => { if (!removing) return; startTransition(async () => { const result = await removeAllowedAdmin({ email: removing }); notifyActionResult(result); if (result.success) setRemoving(null); }); };
  const deleteAccount = () => startTransition(async () => { const result = await deleteOwnAccount(); notifyActionResult(result); if (result.success) router.replace("/auth/login"); });
  return <><div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)]"><AllowedAdminsCard email={email} emails={emails} currentEmail={currentEmail} environmentEmails={environmentEmails} pending={pending} onEmailChange={setEmail} onAdd={add} onRemove={setRemoving} /><DeleteAccountCard onDelete={() => setDeleting(true)} /></div><AlertDialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this administrator?</AlertDialogTitle><AlertDialogDescription>They will no longer be allowed to sign in to the CMS.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>Remove admin</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><AlertDialog open={deleting} onOpenChange={setDeleting}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete your account?</AlertDialogTitle><AlertDialogDescription>This cannot be undone. Your CMS sessions and linked account will be removed.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={pending} onClick={deleteAccount}>Delete my account</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
}
