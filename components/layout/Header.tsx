"use client";

import { Search, Bell, User, ChevronDown } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-slate-950/75 px-4 backdrop-blur-2xl lg:px-6">
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search links..."
          className="h-9 rounded-xl border-white/10 bg-slate-900/70 pl-9 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative rounded-xl p-2 transition-colors hover:bg-white/5">
          <Bell className="h-4 w-4 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0A0A0A]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/5">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-none">John Doe</p>
                <p className="text-xs text-gray-500">Premium</p>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-gray-800 text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}