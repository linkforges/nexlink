import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef, type PropsWithChildren, cloneElement, forwardRef, isValidElement } from "react";

type DropdownMenuProps = PropsWithChildren<{
  className?: string;
}>;

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>;
}

type DropdownMenuTriggerProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

export const DropdownMenuTrigger = forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ...props,
        ref,
      } as any);
    }

    return (
      <button ref={ref as any} type="button" {...props}>
        {children}
      </button>
    );
  },
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type DropdownMenuContentProps = ComponentPropsWithoutRef<"div"> & {
  align?: "start" | "end";
};

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "end", ...props }, ref) => (
    <div ref={ref} className={cn("absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#111827] shadow-xl", className, align === "start" ? "left-0 right-auto" : "right-0 left-auto")}{...props} />
  ),
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("cursor-pointer px-4 py-3 text-sm text-white hover:bg-white/5", className)} {...props} />
  ),
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-3 text-xs uppercase tracking-widest text-gray-500", className)} {...props} />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("my-2 h-px bg-white/10", className)} {...props} />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
