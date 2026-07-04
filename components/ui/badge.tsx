import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "secondary";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white",
  outline: "inline-flex items-center rounded-full border border-white/10 bg-transparent px-2.5 py-1 text-xs font-semibold text-white",
  secondary: "inline-flex items-center rounded-full bg-gray-700 px-2.5 py-1 text-xs font-semibold text-white",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <span ref={ref} className={cn(variants[variant], className)} {...props} />
));
Badge.displayName = "Badge";
