import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  if ((path.startsWith("/login") || path.startsWith("/register")) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const protectedPaths = ["/dashboard", "/links", "/reports", "/domains", "/settings", "/profile"];
  if (protectedPaths.some((p) => path.startsWith(p)) && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
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