"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  PlusCircle,
  FileText,
  Globe,
  Settings,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Link2, label: "All Links", href: "/links" },
  { icon: PlusCircle, label: "Create Link", href: "/links/create" },
  { icon: FileText, label: "Weekly Report", href: "/reports" },
  { icon: Globe, label: "Custom Domains", href: "/domains" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-slate-950/80 p-2 text-white shadow-lg shadow-black/30 backdrop-blur lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-white/10 bg-slate-950/85 backdrop-blur-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            NexGen <span className="text-gradient">Affilates</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-500" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-200"
                  )}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 glow-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}