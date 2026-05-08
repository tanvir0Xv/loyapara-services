import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const protectedPathPrefixes = ["/Dashboard"];
const protectedApiPrefixes = ["/api/complain", "/api/lostFound"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPage = protectedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isProtectedMutationApi = protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isMutationMethod = request.method === "PATCH" || request.method === "DELETE";

  if (!isProtectedPage && !(isProtectedMutationApi && isMutationMethod)) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!secret || !token) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySessionToken(token, secret);
  if (!payload) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Dashboard/:path*", "/api/complain/:path*", "/api/lostFound/:path*"],
};
