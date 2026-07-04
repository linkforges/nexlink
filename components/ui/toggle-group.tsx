import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type HTMLAttributes, type DetailedHTMLProps, forwardRef } from "react";

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex items-center rounded-xl bg-[#111827] p-1", className)} {...props} />
  ),
);
ToggleGroup.displayName = "ToggleGroup";

export const ToggleGroupItem = forwardRef<HTMLButtonElement, DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} type="button" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500", className)} {...props} />
  ),
);
ToggleGroupItem.displayName = "ToggleGroupItem";
