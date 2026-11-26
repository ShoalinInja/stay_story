import { NextResponse, type NextRequest } from "next/server";
import { content } from "./content";
import { placeholdersAllowed } from "./lib/content/placeholders";
import { buildRouteIndex, isKnownPath } from "./lib/routing";

const index = buildRouteIndex(content, placeholdersAllowed());
// No route is three segments deep, so this rewrite always hits the root not-found page with a 404 status.
const NOT_FOUND_PATH = "/_404/_/_";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = new URL(request.url); // not nextUrl.clone(): NextURL re-adds the trailing slash
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }
  if (isKnownPath(pathname, index)) return;
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
}

export const config = {
  // Pages only: skip Next internals and files (images, sitemap.xml, robots.txt), but not .php: unknown legacy URLs must 404.
  matcher: ["/((?!_next/|.*\\.(?!php$)\\w+$).*)"],
};
