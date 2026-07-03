import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const domains = await prisma.domain.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(domains);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { domain } = await req.json();
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });
  const existing = await prisma.domain.findUnique({ where: { domain } });
  if (existing) return NextResponse.json({ error: "Domain already added" }, { status: 400 });
  const verificationToken = randomBytes(32).toString("hex");
  const newDomain = await prisma.domain.create({
    data: {
      domain,
      userId: session.user.id,
      verificationToken,
      verified: false,
    },
  });
  return NextResponse.json(newDomain);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await prisma.domain.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}