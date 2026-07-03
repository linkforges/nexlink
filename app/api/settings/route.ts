import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { countryOffers: true, defaultDestinationUrl: true, defaultNote: true },
  });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { countryOffers, defaultDestinationUrl, defaultNote } = body;
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      countryOffers: countryOffers || undefined,
      defaultDestinationUrl: defaultDestinationUrl || undefined,
      defaultNote: defaultNote || undefined,
    },
  });
  return NextResponse.json({ success: true });
}