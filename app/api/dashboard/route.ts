import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = (await import("@/lib/db")).default;
    const { redis } = await import("@/lib/redis");

    const userId = session.user.id;
    const totalClicks = await prisma.link.aggregate({
      where: { userId, deletedAt: null },
      _sum: { totalClicksCache: true },
    });
    const activeLinks = await prisma.link.count({ where: { userId, deletedAt: null } });
    const geoAgg = await prisma.$queryRaw`
      SELECT "country", SUM(clicks) as clicks
      FROM "GeoBreakdown"
      WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId} AND "deletedAt" IS NULL)
      GROUP BY "country"
      ORDER BY clicks DESC
      LIMIT 1
    `;
    const topCountry = (geoAgg as any[]).length > 0 ? (geoAgg as any[])[0] : { country: "N/A", clicks: 0 };

    const slowLinks = await prisma.link.findMany({
      where: { userId, rotatorMode: "slow", deletedAt: null },
      select: { id: true },
    });
    let pendingUSA = 0;
    for (const link of slowLinks) {
      const val = await redis.get<string | null>(`slow_acc:${link.id}`);
      pendingUSA += parseInt(val || "0", 10);
    }

    const trend = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*) as clicks
      FROM "Click"
      WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId} AND "deletedAt" IS NULL)
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    const geoData = await prisma.$queryRaw`
      SELECT country, SUM(clicks) as clicks
      FROM "GeoBreakdown"
      WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId} AND "deletedAt" IS NULL)
      GROUP BY country
      ORDER BY clicks DESC
      LIMIT 10
    `;

    return NextResponse.json({
      totalClicks: totalClicks._sum.totalClicksCache || 0,
      activeLinks,
      topCountry,
      pendingUSA,
      trendData: trend,
      geoData: geoData,
    });
  } catch (error) {
    console.error("Dashboard data unavailable", error);
    return NextResponse.json({
      totalClicks: 0,
      activeLinks: 0,
      topCountry: { country: "N/A", clicks: 0 },
      pendingUSA: 0,
      trendData: [],
      geoData: [],
    });
  }
}