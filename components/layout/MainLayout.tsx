"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Sidebar />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}