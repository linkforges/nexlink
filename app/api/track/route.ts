import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { linkId, country, clicks, visitorHash, isUnique } = await req.json();
    if (!linkId || clicks === undefined) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("x-real-ip") ||
               "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "";
    const isFake = !referrer || referrer.trim() === "";

    // Increment total cache only if unique and not fake
    if (isUnique && !isFake) {
      await prisma.link.update({
        where: { id: linkId },
        data: { totalClicksCache: { increment: clicks } },
      });
    }

    if (country) {
      await prisma.$executeRaw`
        INSERT INTO "GeoBreakdown" ("linkId", "country", "clicks", "updatedAt")
        VALUES (${linkId}, ${country}, ${clicks}, NOW())
        ON CONFLICT ("linkId", "country")
        DO UPDATE SET "clicks" = "GeoBreakdown"."clicks" + ${clicks}, "updatedAt" = NOW()
      `;
    }

    if (isUnique && visitorHash) {
      // Parse device/browser
      let device = "unknown";
      let browser = "unknown";
      let os = "unknown";
      if (userAgent.includes("Mobile")) device = "Mobile";
      else if (userAgent.includes("Tablet")) device = "Tablet";
      else device = "Desktop";

      if (userAgent.includes("Chrome")) browser = "Chrome";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("Edge")) browser = "Edge";
      else browser = "Other";

      if (userAgent.includes("Windows")) os = "Windows";
      else if (userAgent.includes("Mac OS")) os = "macOS";
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iOS")) os = "iOS";
      else os = "Other";

      await prisma.click.create({
        data: {
          linkId,
          visitorHash,
          country,
          isUnique: true,
          device,
          browser,
          os,
          referrer,
        },
      });

      await prisma.clickLog.create({
        data: {
          linkId,
          visitorHash,
          country,
          device,
          browser,
          os,
          referrer,
          ip,
          userAgent,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}