import { cn } from "@/lib/utils";
import { forwardRef, type DetailedHTMLProps, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
