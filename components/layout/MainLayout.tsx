"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-50">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}