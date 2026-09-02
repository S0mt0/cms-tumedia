import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  variant?: "success" | "error" | "neutral";
};

export function FormMessage({ message, variant = "neutral" }: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm font-medium leading-6",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        variant === "error" && "border-red-200 bg-red-50 text-red-800",
        variant === "neutral" && "border-slate-200 bg-slate-50 text-slate-700"
      )}
    >
      {message}
    </p>
  );
}
