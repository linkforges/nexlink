import { cn } from "@/lib/utils";
import { forwardRef, type DetailedHTMLProps, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "block w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
