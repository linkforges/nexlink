import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const linkId = params.id;
  const link = await prisma.link.findUnique({
    where: { id: linkId, userId: session.user.id },
    include: {
      clickLogs: {
        orderBy: { createdAt: "desc" },
        take: 1000,
      },
    },
  });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const logs = link.clickLogs;
  const uniqueVisitors = new Set(logs.map(l => l.visitorHash)).size;

  const countryCount: Record<string, number> = {};
  logs.forEach(l => {
    if (l.country) countryCount[l.country] = (countryCount[l.country] || 0) + 1;
  });
  const topCountry = Object.entries(countryCount).sort((a, b) => b[1] - a[1])[0];

  const visitorHashCount: Record<string, number> = {};
  logs.forEach(l => { visitorHashCount[l.visitorHash] = (visitorHashCount[l.visitorHash] || 0) + 1; });

  const tableData = logs.map(log => ({
    id: log.id,
    time: log.createdAt,
    ip: log.ip || "—",
    location: log.country || "—",
    browser: log.browser || "—",
    referrer: log.referrer || "direct",
    device: log.device || "—",
    isDuplicate: visitorHashCount[log.visitorHash] > 1,
    isFake: !log.referrer || log.referrer.trim() === "",
  }));

  return NextResponse.json({
    totalUnique: uniqueVisitors,
    topCountry: topCountry ? { country: topCountry[0], clicks: topCountry[1] } : null,
    logs: tableData,
  });
}