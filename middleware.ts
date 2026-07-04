import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/links", "/reports", "/domains", "/settings", "/profile"];

function buildLoginRedirect(req: any) {
  const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(loginUrl);
}

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/register")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/login") && session?.user) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/dashboard";
    const safeRedirect = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
    return NextResponse.redirect(new URL(safeRedirect, req.url));
  }

  if (protectedPaths.some((p) => path.startsWith(p)) && !session?.user) {
    return buildLoginRedirect(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/links/:path*",
    "/reports/:path*",
    "/domains/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};