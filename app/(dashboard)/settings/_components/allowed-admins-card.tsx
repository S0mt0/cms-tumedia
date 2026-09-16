"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  email: string;
  emails: string[];
  currentEmail: string;
  environmentEmails: string[];
  pending: boolean;
  onEmailChange: (email: string) => void;
  onAdd: () => void;
  onRemove: (email: string) => void;
};

export function AllowedAdminsCard({
  email,
  emails,
  currentEmail,
  environmentEmails,
  pending,
  onEmailChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <section className="rounded-xl border border-[#c5d4cd] bg-white p-5">
      <h2 className="text-xl font-bold text-[#173c38]">Allowed admins</h2>
      <p className="mt-2 text-sm leading-6 text-[#61746d]">
        These emails can sign in to the CMS. Environment administrators are
        pinned and cannot be removed here.
      </p>
      <div className="mt-5 flex gap-2">
        <Input
          value={email}
          type="email"
          placeholder="admin@example.com"
          disabled={pending}
          onChange={(event) => onEmailChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
        />
        <Button
          type="button"
          disabled={pending || !email.trim()}
          onClick={onAdd}
        >
          <Plus aria-hidden />
          Add admin
        </Button>
      </div>
      <ul className="mt-5 divide-y rounded-lg border border-[#d7e1dc]">
        {emails.map((item) => {
          const pinned = environmentEmails.includes(item);
          return (
            <li
              className="flex items-center justify-between gap-4 p-4"
              key={item}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#173c38]">{item}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#52605d]">
                  <span className="rounded-full border border-[#c5d4cd] px-2 py-0.5">
                    {pinned ? "Super admin" : "Admin"}
                  </span>
                  {item === currentEmail ? (
                    <span className="rounded-full border border-[#c5d4cd] px-2 py-0.5">
                      You
                    </span>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 text-destructive"
                disabled={pending || pinned}
                onClick={() => onRemove(item)}
              >
                <Trash2 aria-hidden />
                Remove
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
