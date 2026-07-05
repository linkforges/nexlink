"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session, status } = useSession();
  const displayName = session?.user?.name || session?.user?.email || "Admin";
  const initials = displayName
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-slate-950/85 px-4 shadow-[0_10px_45px_rgba(2,8,23,0.38)] backdrop-blur-2xl lg:px-6">
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/80" />
        <Input
          placeholder="Search links..."
          className="h-9 rounded-xl border-white/10 bg-slate-900/70 pl-9 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200">
          <Bell className="h-4 w-4 text-gray-300" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0A0A0A]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 via-sky-500 to-fuchsia-500 text-xs text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none text-white">{displayName}</p>
                <p className="text-xs text-gray-500">{status === "authenticated" ? "Online" : "Secure"}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border border-cyan-400/10 bg-[#111827] text-white shadow-[0_20px_80px_rgba(2,8,23,0.45)]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Billing</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/5">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="cursor-pointer text-rose-400 hover:bg-rose-500/10" onClick={handleSignOut}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}