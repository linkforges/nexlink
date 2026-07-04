import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Registration is disabled. Please sign in with the built-in administrator account." },
    { status: 403 }
  );
}