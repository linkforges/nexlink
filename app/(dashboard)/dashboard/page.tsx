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
    <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-slate-400 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400" />
        <span>Loading your workspace...</span>
      </div>
    </div>
  );

  if (!stats) return <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" />
            Growth command center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">A live view of your latest campaigns and audience behavior.</p>
        </div>
        <p className="text-sm text-slate-400">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} trend="+12%" />
        <KPICard title="Active Links" value={stats.activeLinks} icon={Link2} trend="+2" />
        <KPICard title="Top Country" value={stats.topCountry.country} subtitle={`${stats.topCountry.clicks} clicks`} icon={Globe} />
        <KPICard title="Pending USA (Slow)" value={stats.pendingUSA} icon={Users} subtitle="waiting for 3rd visitor" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Click Trend</CardTitle>
          </CardHeader>
          <CardContent><ClickTrendChart data={stats.trendData} /></CardContent>
        </Card>
        <Card className="border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Geo Breakdown</CardTitle>
          </CardHeader>
          <CardContent><GeoMap data={stats.geoData} /></CardContent>
        </Card>
      </div>
    </div>
  );
}