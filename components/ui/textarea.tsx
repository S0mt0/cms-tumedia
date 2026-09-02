import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-md border border-[#b7c8c0] bg-[#fffdfa] px-3 py-2.5 text-base text-[#163a37] transition-colors outline-none placeholder:text-slate-400 focus-visible:border-[#1d8f7a] focus-visible:ring-3 focus-visible:ring-[#1d8f7a]/15 disabled:cursor-not-allowed disabled:bg-[#edf3f0] disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
