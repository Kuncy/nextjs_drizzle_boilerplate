import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // If no session, redirect to login
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "auth/login";
    return NextResponse.redirect(url);
  }

  // If authenticated, continue
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // protect these paths
};
