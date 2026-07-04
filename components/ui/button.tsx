import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
