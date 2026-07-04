import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const linkId = params.id;
  const link = await prisma.link.findUnique({ where: { id: linkId, userId: session.user.id } });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const country = searchParams.get("country") || "";
  const device = searchParams.get("device") || "";

  const where: any = { linkId };
  if (country) where.country = { contains: country, mode: "insensitive" };
  if (device) where.device = { contains: device, mode: "insensitive" };

  const [logs, total] = await Promise.all([
    prisma.clickLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        country: true,
        device: true,
        browser: true,
        os: true,
        referrer: true,
        visitorHash: true,
        ip: true,
      },
    }),
    prisma.clickLog.count({ where }),
  ]);
  return NextResponse.json({ logs, total });
}