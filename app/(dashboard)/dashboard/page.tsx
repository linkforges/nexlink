"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { ClickTrendChart } from "@/components/dashboard/ClickTrendChart";
import { GeoMap } from "@/components/dashboard/GeoMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Link2, Globe, Users, Sparkles } from "lucide-react";

interface DashboardStats {
  totalClicks: number;
  activeLinks: number;
  topCountry: { country: string; clicks: number };
  pendingUSA: number;
  trendData: { date: string; clicks: number }[];
  geoData: { country: string; clicks: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center rounded-[28px] border border-cyan-400/15 bg-slate-950/70 p-8 text-slate-300 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
        <span>Loading your intelligent workspace...</span>
      </div>
    </div>
  );

  if (!stats) return <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="frosted-panel relative overflow-hidden rounded-[28px] p-6 sm:flex sm:items-end sm:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.2),_transparent_28%)]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Growth command center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">AI Signal Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">A live pulse of your campaign momentum, audience movement, and conversion signals across the last 30 days.</p>
        </div>
        <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:mt-0">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Live • Auto-updating
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} trend="+12%" />
        <KPICard title="Active Links" value={stats.activeLinks} icon={Link2} trend="+2" />
        <KPICard title="Top Country" value={stats.topCountry.country} subtitle={`${stats.topCountry.clicks} clicks`} icon={Globe} />
        <KPICard title="Pending USA (Slow)" value={stats.pendingUSA} icon={Users} subtitle="waiting for 3rd visitor" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="frosted-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Click Trend</CardTitle>
          </CardHeader>
          <CardContent><ClickTrendChart data={stats.trendData} /></CardContent>
        </Card>
        <Card className="frosted-panel">
          <CardHeader>
            <CardTitle className="text-white">Geo Breakdown</CardTitle>
          </CardHeader>
          <CardContent><GeoMap data={stats.geoData} /></CardContent>
        </Card>
      </div>
    </div>
  );
}