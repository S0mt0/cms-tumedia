"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormMessage } from "@/components/common/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { getSafeCallbackUrl } from "@/lib/auth/routes";
import {
  magicLinkSchema,
  type MagicLinkInput,
} from "@/lib/schemas/auth.schema";

type Feedback = { type: "error" | "success"; message: string };

const authErrorCopy: Record<string, string> = {
  FORBIDDEN:
    "This account is not authorised to access the CMS. Request access from an administrator if you need it.",
  unauthorized: "This account is not authorised to access the CMS.",
  unable_to_create_user:
    "This account is not on the CMS administrator allowlist.",
  access_denied:
    "Google sign-in was cancelled or access was declined. Please try again.",
  INVALID_TOKEN: "Session expired. Request another secure email link.",
};

function getUrlFeedback(searchParams: URLSearchParams): Feedback | undefined {
  const code = searchParams.get("error") ?? searchParams.get("code");
  if (!code) return undefined;

  return {
    type: "error",
    message:
      authErrorCopy[code] ??
      searchParams.get("error_description") ??
      "We could not complete sign-in. Please try again or request a secure email link.",
  };
}

export function LoginForm({
  accessRequestEmail,
}: {
  accessRequestEmail?: string;
}) {
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState<Feedback | undefined>(() =>
    getUrlFeedback(searchParams)
  );
  const [submitting, setSubmitting] = useState<"google" | "link" | "none">(
    "none"
  );
  const callbackURL = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function requestMagicLink(values: MagicLinkInput) {
    setSubmitting("link");
    setFeedback(undefined);

    try {
      const { error } = await authClient.signIn.magicLink({
        email: values.email,
        callbackURL,
        errorCallbackURL: "/auth/login",
      });

      if (error) {
        setFeedback({
          type: "error",
          message: error.message ?? "We could not send that sign-in link.",
        });
        return;
      }

      form.reset();
      setFeedback({
        type: "success",
        message: "Check your email for a secure sign-in link.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "We could not start the sign-in request. Please try again.",
      });
    } finally {
      setSubmitting("none");
    }
  }

  async function signInWithGoogle() {
    setSubmitting("google");
    setFeedback(undefined);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: "/auth/login",
      });

      if (error) {
        setFeedback({
          type: "error",
          message: error.message ?? "Google sign-in could not start.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Google sign-in could not start. Please try again.",
      });
    } finally {
      setSubmitting("none");
    }
  }

  const accessRequestHref = accessRequestEmail
    ? `mailto:${accessRequestEmail}?subject=${encodeURIComponent(
        "TU Media CMS access request"
      )}&body=${encodeURIComponent(
        "Hello,\n\nPlease grant me access to the TU Media CMS."
      )}`
    : undefined;

  return (
    <div className="space-y-5">
      <Button
        type="button"
        onClick={signInWithGoogle}
        disabled={submitting !== "none"}
        className="h-11 w-full"
      >
        {submitting === "google" ? (
          <>
            <Spinner /> Please wait…
          </>
        ) : (
          "Continue with Google"
        )}
      </Button>
      <div className="relative text-center text-xs text-slate-500 before:absolute before:inset-x-0 before:top-1/2 before:border-t before:border-slate-200">
        <span className="relative bg-white px-3">or</span>
      </div>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(requestMagicLink)(event);
        }}
        noValidate
      >
        <Label className="block text-slate-800" htmlFor="email">
          Work email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-describedby={
            form.formState.errors.email ? "email-error" : undefined
          }
          className="mt-2 h-11 rounded-xl border-slate-300 px-3"
          disabled={submitting !== "none"}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
            event.preventDefault();
            void form.handleSubmit(requestMagicLink)();
          }}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p id="email-error" className="text-sm text-red-700">
            {form.formState.errors.email.message}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={submitting !== "none"}
          variant="outline"
          className="mt-3 h-11 w-full"
        >
          {submitting === "link" ? (
            <>
              <Spinner /> Please wait…
            </>
          ) : (
            "Email me a sign-in link"
          )}
        </Button>
      </form>
      <FormMessage message={feedback?.message} variant={feedback?.type} />
      {accessRequestHref ? (
        <p className="text-center text-sm leading-6 text-slate-600">
          Need access?{" "}
          <a
            href={accessRequestHref}
            className="font-semibold text-[#7047eb] underline underline-offset-4"
          >
            Request access by email
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
