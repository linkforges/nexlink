import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, Globe2, ShieldCheck, Sparkles, Zap, Cpu, Layers3 } from "lucide-react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Smarter affiliate link control",
  description: "Launch polished campaigns, route traffic intelligently, and monitor performance in one premium dashboard.",
};

const features = [
  {
    title: "Live geo targeting",
    description: "Route clicks by country, device, and behavior in real time.",
    icon: Globe2,
  },
  {
    title: "Smart analytics",
    description: "Track performance, revenue trends, and audience quality at a glance.",
    icon: BarChart3,
  },
  {
    title: "Secure delivery",
    description: "Protect your links with trusted redirects and enterprise-grade controls.",
    icon: ShieldCheck,
  },
];

const workflowSteps = [
  {
    title: "Launch with confidence",
    description: "Create polished links in minutes with branded routing and smart defaults.",
    icon: Zap,
  },
  {
    title: "Optimize continuously",
    description: "See live performance signals and adapt your campaigns instantly.",
    icon: Cpu,
  },
  {
    title: "Scale professionally",
    description: "Manage teams, domains, and reports from a unified premium workspace.",
    icon: Layers3,
  },
];

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-6%] h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">NexGen Affiliates</p>
              <p className="text-xs text-slate-400">Smarter link control for modern growth teams</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="#features" className="transition hover:text-white">Features</Link>
            <Link href="#workflow" className="transition hover:text-white">Workflow</Link>
            <Link href="/login" className="transition hover:text-white">Sign in</Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-purple-500"
            >
              Access dashboard
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
              <Sparkles className="h-4 w-4" />
              New: advanced affiliate routing and real-time performance reports
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn every click into a smarter growth decision.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
              Launch polished landing flows, control your offer rotation, and monitor conversion quality from one beautiful command center.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-purple-500"
              >
                Access dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Unlimited links</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Dynamic geo routes</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Weekly reports</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 via-slate-900/80 to-purple-500/20 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-300">Overview</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:-translate-y-1">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                        <Icon className="h-5 w-5 text-blue-200" />
                      </div>
                      <h2 className="font-semibold text-white">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-4 pb-8 md:grid-cols-3">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-black/20 backdrop-blur-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/25 to-purple-500/25 text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}