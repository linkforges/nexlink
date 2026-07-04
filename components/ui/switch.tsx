import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-6 w-11 rounded-full border border-white/10 bg-white/5 transition duration-200 ease-in-out checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        className,
      )}
      onChange={event => {
        onCheckedChange?.(event.target.checked);
        onChange?.(event);
      }}
      {...props}
    />
  ),
);
Switch.displayName = "Switch";
