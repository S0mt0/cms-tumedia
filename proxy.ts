import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSafeCallbackUrl,
  isAuthRoute,
  isPublicRoute,
} from "@/lib/auth/routes";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (isAuthRoute(pathname) && sessionCookie) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(
      new URL(getSafeCallbackUrl(callbackUrl), request.url)
    );
  }

  if (isPublicRoute(pathname)) return NextResponse.next();

  if (!sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
