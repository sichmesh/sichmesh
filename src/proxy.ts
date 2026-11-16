import { NextResponse } from "next/server";

/**
 * Site-wide security headers. Light enough to keep every page statically prerendered.
 */
export function proxy() {
  const res = NextResponse.next();
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()"
  );
  return res;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|txt|json|xml|bin|webmanifest)$).*)",
    },
  ],
};
