import { cn } from "@/lib/utils";
import { forwardRef, type DetailedHTMLProps, type LabelHTMLAttributes } from "react";

export const Label = forwardRef<
  HTMLLabelElement,
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("block text-sm font-medium text-gray-300", className)} {...props} />
));
Label.displayName = "Label";
