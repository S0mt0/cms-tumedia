"use client";

import { toast } from "sonner";

import type { ActionResult, AsyncResult } from "@/lib/types/content";

export function notifyActionResult(result: ActionResult) {
  if (result.success) toast.success(result.message ?? "Changes saved.");
  else toast.error(result.message);
}

export function notifyAsyncResult(result: AsyncResult) {
  if (result.error) toast.error(result.error);
  else if (result.success) toast.success(result.success);
}
