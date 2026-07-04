import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ImgHTMLAttributes, forwardRef } from "react";

export const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} className={cn("inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#111827]", props.className)} {...props} />
));
Avatar.displayName = "Avatar";

export const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>((props, ref) => (
  <img ref={ref} className={cn("aspect-square h-full w-full object-cover", props.className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white", props.className)} {...props} />
));
AvatarFallback.displayName = "AvatarFallback";
