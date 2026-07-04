import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type HTMLAttributes, forwardRef } from "react";

type TabsProps = HTMLAttributes<HTMLDivElement> & { value?: string; defaultValue?: string };

type TabsContentProps = HTMLAttributes<HTMLDivElement> & { value?: string };

type TabTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { value?: string };

export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <div ref={ref} className={cn("space-y-4", props.className)} {...props} />
));
Tabs.displayName = "Tabs";

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} className={cn("inline-flex rounded-xl border border-white/10 bg-[#111827] p-1", props.className)} {...props} />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(({ className, ...props }, ref) => (
  <button ref={ref} type="button" className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none", className)} {...props} />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>((props, ref) => (
  <div ref={ref} className={cn("rounded-3xl border border-white/10 bg-[#111827] p-4", props.className)} {...props} />
));
TabsContent.displayName = "TabsContent";
