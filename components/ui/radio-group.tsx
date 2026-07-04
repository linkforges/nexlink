import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type DetailedHTMLProps, type InputHTMLAttributes, type HTMLAttributes, forwardRef } from "react";

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex flex-col gap-2", className)} {...props} />
  ),
);
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, type = "radio", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn("h-4 w-4 rounded-full border border-white/10 text-blue-500 focus:ring-blue-500", className)}
    {...props}
  />
));
RadioGroupItem.displayName = "RadioGroupItem";
