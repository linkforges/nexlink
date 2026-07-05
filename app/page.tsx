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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#07111f_40%,_#111827_100%)] text-slate-50">
      <div className="particle-bg -z-10">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${8 + index * 5}%`,
              top: `${10 + (index % 6) * 12}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${10 + (index % 4) * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-orb absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="ambient-orb absolute bottom-[-8%] right-[-6%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-float-slower absolute left-[10%] top-[20%] h-24 w-24 rounded-full border border-cyan-400/20" />
        <div className="animate-float-slower absolute bottom-[18%] left-[40%] h-16 w-16 rounded-full border border-fuchsia-400/20" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="frosted-panel flex flex-wrap items-center justify-between gap-4 rounded-full px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">NexGen Affiliates</p>
              <p className="text-xs text-slate-400">The premium command center for modern growth teams</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <Link href="#features" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">Features</Link>
            <Link href="#workflow" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">Workflow</Link>
            <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">Sign in</Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
            >
              Access dashboard
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              New: intelligent routing, live insight, and premium control at scale
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn every click into a <span className="text-gradient">smarter growth signal</span>.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
              Launch polished flows, orchestrate your offer rotation, and monitor performance from one beautiful command center built for ambitious teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="neon-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20"
              >
                Access dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="neon-button inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore workspace
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Unlimited links</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Dynamic geo routes</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Weekly reports</span>
            </div>
          </div>

          <div className="frosted-panel rounded-[28px] p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900/80 to-fuchsia-500/20 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-300">Overview</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30">
                        <Icon className="h-5 w-5 text-cyan-100" />
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
              <div key={step.title} className="frosted-panel rounded-[24px] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/25 text-cyan-100">
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