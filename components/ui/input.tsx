import { cn } from "@/lib/utils";
import { forwardRef, type DetailedHTMLProps, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "block w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
