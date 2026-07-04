import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const linkId = params.id;
  await prisma.link.update({
    where: { id: linkId, userId: session.user.id },
    data: { totalClicksCache: 0, slowAccumulator: 0 },
  });
  await prisma.click.deleteMany({ where: { linkId } });
  await prisma.clickLog.deleteMany({ where: { linkId } });
  await prisma.$executeRaw`DELETE FROM "GeoBreakdown" WHERE "linkId" = ${linkId}`;
  await redis.del(`slow_acc:${linkId}`);
  await redis.del(`visitors:${linkId}`);
  return NextResponse.json({ success: true });
}