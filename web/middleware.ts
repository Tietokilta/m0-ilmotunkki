import { NextRequest, NextResponse } from "next/server";

// From: https://nextjs.org/docs/app/building-your-application/routing/internationalization
export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/uploads")) {
    const destination = new URL(
      process.env.STRAPI_URL || "http://localhost:1337",
    );
    const url = request.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.pathname = pathname;
    return NextResponse.rewrite(url);
  }

  const locales = ["fi", "en"];
  const defaultLocale = "fi";
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    return;
  }
  return NextResponse.redirect(
    new URL(`/${defaultLocale}/${pathname}`, request.url),
  );
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next|favicon.ico).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
