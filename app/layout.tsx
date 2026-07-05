import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { MainLayout } from "@/components/layout/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexgen-affilates.vercel.app"),
  title: {
    default: "NexGen Affiliates | Smarter link control for growth teams",
    template: "%s | NexGen Affiliates",
  },
  description:
    "NexGen Affiliates helps modern marketers launch polished campaigns, manage smart redirects, and monitor performance with premium analytics.",
  keywords: [
    "affiliate links",
    "link tracking",
    "geo routing",
    "campaign analytics",
    "smart redirects",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NexGen Affiliates",
    description: "Premium affiliate link management with elegant analytics and geo targeting.",
    url: "/",
    siteName: "NexGen Affiliates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexGen Affiliates",
    description: "Premium affiliate link management with elegant analytics and geo targeting.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased text-foreground`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "NexGen Affiliates",
              operatingSystem: "Web",
              applicationCategory: "BusinessApplication",
              description:
                "NexGen Affiliates helps modern marketers launch polished campaigns, manage smart redirects, and monitor performance with premium analytics.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <SessionProvider session={session}>
          {session ? <MainLayout>{children}</MainLayout> : children}
        </SessionProvider>
      </body>
    </html>
  );
}