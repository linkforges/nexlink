import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Resend } from "resend";
import { renderToStream } from "@react-pdf/renderer";
import { ReportPDF } from "@/components/reports/ReportPDF";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Resend API key not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const users = await prisma.user.findMany({
    include: {
      links: {
        where: { deletedAt: null },
        include: {
          clickLogs: {
            where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          },
        },
      },
    },
  });

  for (const user of users) {
    if (!user.email) continue;
    const stream = await renderToStream(<ReportPDF user={user} />);
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    await resend.emails.send({
      from: "NexGen Affilates <reports@nexgen-affilates.com>",
      to: user.email,
      subject: "Your Weekly Affiliate Report",
      text: "See attached PDF for your weekly link performance.",
      attachments: [
        {
          filename: `weekly-report-${user.id}.pdf`,
          content: pdfBuffer.toString("base64"),
          content_type: "application/pdf",
        },
      ],
    });
  }

  return NextResponse.json({ success: true });
}
