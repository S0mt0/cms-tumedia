"use client";

import { toast } from "sonner";

export function notifyActionResult(result: ActionResult) {
  if (result.success) toast.success(result.message ?? "Changes saved.");
  else toast.error(result.message);
}

export function notifyAsyncResult<T>(result: AsyncResult<T>) {
  if (result.error) toast.error(result.error);
  else if (result.success) toast.success(result.success);
}
