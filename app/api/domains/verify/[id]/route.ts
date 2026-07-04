import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import dns from "dns/promises";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const domain = await prisma.domain.findUnique({
    where: { id: params.id, userId: session.user.id },
  });
  if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

  try {
    // For production, you may want to check a specific TXT record.
    // Here we simply verify that the domain resolves (A record exists)
    await dns.resolve(domain.domain, "A");
    await prisma.domain.update({
      where: { id: domain.id },
      data: { verified: true },
    });
    return NextResponse.json({ verified: true });
  } catch (error) {
    return NextResponse.json({ verified: false, error: "DNS resolution failed" }, { status: 400 });
  }
}