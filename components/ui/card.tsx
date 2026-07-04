import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-3xl border border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <div ref={ref} className={cn("space-y-2 p-6", props.className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>((props, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold text-white", props.className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>((props, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-400", props.className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <div ref={ref} className={cn("px-6 pb-6 pt-2", props.className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <div ref={ref} className={cn("px-6 pb-6 pt-4", props.className)} {...props} />
));
CardFooter.displayName = "CardFooter";
