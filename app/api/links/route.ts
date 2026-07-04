import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const links = await prisma.link.findMany({
    where: { userId: session.user.id, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
      rotatorMode: true,
      totalClicksCache: true,
      publicToken: true,
      slowAccumulator: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, destinationUrl, domain, slug, rotatorMode, note } = body;
  if (!name || !destinationUrl || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const finalDomain = domain || "default";
  const existing = await prisma.link.findUnique({ where: { domain_slug: { domain: finalDomain, slug } } });
  if (existing) {
    return NextResponse.json({ error: "Slug already taken on this domain" }, { status: 400 });
  }
  const link = await prisma.link.create({
    data: {
      name,
      destinationUrl,
      domain: finalDomain,
      slug,
      rotatorMode: rotatorMode || "turbo",
      note: note || "",
      userId: session.user.id,
      totalClicksCache: 0,
    },
  });
  return NextResponse.json(link);
}