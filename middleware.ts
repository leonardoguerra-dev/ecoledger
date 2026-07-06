import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "it"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const acceptLanguage = request.headers.get("accept-language");
  let detectedLocale = defaultLocale;

  if (acceptLanguage && acceptLanguage.includes("it")) {
    detectedLocale = "it";
  }

  request.nextUrl.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // -------------------------------------------------------------------------
  // FIXED MATCHER: Added explicit exclusion for 'mock' directory and '.json' extensions
  // to prevent the middleware from intercepting frontend internal dataset requests.
  // -------------------------------------------------------------------------
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|locales|assets|mock|.*\\.json$).*)',
  ],
};