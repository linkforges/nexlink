import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const logs = await prisma.clickLog.findMany({
    where: {
      link: {
        userId: session.user.id,
        deletedAt: null,
      },
      createdAt: { gte: sevenDaysAgo },
    },
    include: { link: true },
  });

  const map: Record<string, { linkName: string; country: string; uniqueVisitors: Set<string> }> = {};
  logs.forEach(log => {
    const key = `${log.linkId}:${log.country}`;
    if (!map[key]) {
      map[key] = {
        linkName: log.link.name,
        country: log.country || "Unknown",
        uniqueVisitors: new Set(),
      };
    }
    map[key].uniqueVisitors.add(log.visitorHash);
  });

  const result = Object.values(map).map(item => ({
    linkName: item.linkName,
    country: item.country,
    uniqueClicks: item.uniqueVisitors.size,
    throttledClicks: item.country === "US" ? Math.floor(item.uniqueVisitors.size / 3) : item.uniqueVisitors.size,
  }));

  return NextResponse.json(result);
}