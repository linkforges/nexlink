import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  let records;
  try {
    records = parse(text, { columns: true, skip_empty_lines: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
  }

  const errors: string[] = [];
  let success = 0;
  for (const row of records) {
    const { name, destinationUrl, slug, rotatorMode, note } = row;
    if (!name || !destinationUrl || !slug) {
      errors.push(`Missing fields for row: ${JSON.stringify(row)}`);
      continue;
    }
    const mode = (rotatorMode === "slow") ? "slow" : "turbo";
    try {
      await prisma.link.create({
        data: {
          name,
          destinationUrl,
          slug,
          domain: "default",
          rotatorMode: mode,
          note: note || "",
          userId: session.user.id,
          totalClicksCache: 0,
        },
      });
      success++;
    } catch (e: any) {
      errors.push(`Failed to create link "${name}": ${e.message}`);
    }
  }
  return NextResponse.json({ success, errors });
}