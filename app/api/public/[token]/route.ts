import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;
  const link = await prisma.link.findUnique({
    where: { publicToken: token },
    include: {
      clickLogs: {
        select: { createdAt: true, country: true, device: true, referrer: true },
      },
    },
  });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const clicks = link.clickLogs;
  const totalClicks = clicks.length;

  const now = new Date();
  const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const filtered = clicks.filter(c => new Date(c.createdAt) >= thirtyDays);
  const trendMap: Record<string, number> = {};
  filtered.forEach(c => {
    const date = new Date(c.createdAt).toISOString().split('T')[0];
    trendMap[date] = (trendMap[date] || 0) + 1;
  });
  const trendData = Object.entries(trendMap).map(([date, clicks]) => ({ date, clicks }));

  const geoMap: Record<string, number> = {};
  clicks.forEach(c => { if (c.country) geoMap[c.country] = (geoMap[c.country] || 0) + 1; });
  const geoData = Object.entries(geoMap).map(([country, clicks]) => ({ country, clicks })).sort((a,b) => b.clicks - a.clicks).slice(0, 10);

  const refMap: Record<string, number> = {};
  clicks.forEach(c => { if (c.referrer) refMap[c.referrer] = (refMap[c.referrer] || 0) + 1; });
  const topReferrers = Object.entries(refMap).map(([referrer, count]) => ({ referrer, count })).sort((a,b) => b.count - a.count).slice(0, 5);

  const devMap: Record<string, number> = {};
  clicks.forEach(c => { if (c.device) devMap[c.device] = (devMap[c.device] || 0) + 1; });
  const topDevices = Object.entries(devMap).map(([device, count]) => ({ device, count })).sort((a,b) => b.count - a.count).slice(0, 5);

  return NextResponse.json({
    totalClicks,
    trendData,
    geoData,
    topReferrers,
    topDevices,
  });
}