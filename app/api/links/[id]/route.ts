import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const link = await prisma.link.findUnique({
    where: { id: params.id, userId: session.user.id },
    select: {
      id: true,
      name: true,
      destinationUrl: true,
      domain: true,
      slug: true,
      rotatorMode: true,
      note: true,
    },
  });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  return NextResponse.json(link);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, destinationUrl, domain, slug, rotatorMode, note } = body;
  const link = await prisma.link.update({
    where: { id: params.id, userId: session.user.id },
    data: { name, destinationUrl, domain, slug, rotatorMode, note },
  });
  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.link.update({
    where: { id: params.id, userId: session.user.id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}