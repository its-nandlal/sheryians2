
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  )
    return NextResponse.next();

  // Check session cookie
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const isLoggedIn = !!sessionToken;

  // Logged in user - role check redirect
  if (isLoggedIn) {
    try {
      // Session se user role fetch karein
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      const userRole = (session?.user as { role?: "STUDENT" | "OWNER" })
        ?.role as "STUDENT" | "OWNER" | undefined;

      // Home page role-based redirect
      if (pathname === "/") {
        if (userRole === "OWNER")
          return NextResponse.redirect(
            new URL("/owner/dashboard", request.url)
          );
        if (userRole === "STUDENT")
          return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Protect owner routes access check
      if (userRole === "STUDENT" && pathname.startsWith("/owner")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Protect student routes access check
      if (userRole === "OWNER" && pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/owner/dashboard", request.url));
      }
    } catch (error) {
      console.error("Session fetch error:", error);
      // Error case - default dashboard
      if (pathname === "/")
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    const protectedRoutes = ["/dashboard", "/owner"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute)
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};