"use client";

import type { ActionResult } from "@/lib/types/content";
import { FormMessage } from "@/components/common/form-message";

type FormFeedbackProps = { result?: ActionResult };

export function FormFeedback({ result }: FormFeedbackProps) {
  if (!result?.message) return null;

  return <FormMessage message={result.message} variant={result.success ? "success" : "error"} />;
}
