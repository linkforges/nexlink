"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.16),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-50">
      <div className="particle-bg pointer-events-none">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${12 + index * 6}%`,
              top: `${10 + (index % 5) * 14}%`,
              animationDelay: `${index * 0.7}s`,
              animationDuration: `${10 + (index % 3) * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb absolute left-[-10%] top-[-6%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="ambient-orb absolute bottom-[-12%] right-[-8%] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <Sidebar />
      <div className="relative flex min-h-screen flex-col lg:ml-[260px]">
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