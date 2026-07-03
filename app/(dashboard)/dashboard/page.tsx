"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { ClickTrendChart } from "@/components/dashboard/ClickTrendChart";
import { GeoMap } from "@/components/dashboard/GeoMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Link2, Globe, Users } from "lucide-react";

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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-400">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} trend="+12%" />
        <KPICard title="Active Links" value={stats.activeLinks} icon={Link2} trend="+2" />
        <KPICard title="Top Country" value={stats.topCountry.country} subtitle={`${stats.topCountry.clicks} clicks`} icon={Globe} />
        <KPICard title="Pending USA (Slow)" value={stats.pendingUSA} icon={Users} subtitle="waiting for 3rd visitor" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 glass border-white/10">
          <CardHeader><CardTitle className="text-white">Click Trend</CardTitle></CardHeader>
          <CardContent><ClickTrendChart data={stats.trendData} /></CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-white">Geo Breakdown</CardTitle></CardHeader>
          <CardContent><GeoMap data={stats.geoData} /></CardContent>
        </Card>
      </div>
    </div>
  );
}