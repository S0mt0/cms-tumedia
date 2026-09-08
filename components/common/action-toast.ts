"use client";

import { toast } from "sonner";

export function notifyActionResult<T>(result: ActionResult<T>) {
  if (result.success) toast.success(result.message ?? "Changes saved.");
  else toast.error(result.message);
}

export function notifyAsyncResult<T>(result: AsyncResult<T>) {
  if (result.error) toast.error(result.error);
  else if (result.success) toast.success(result.success);
}
