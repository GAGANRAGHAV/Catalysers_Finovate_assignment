import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // Redirect to login if no token is found
    return NextResponse.redirect(new URL("/loginsignup", request.url));
  }

  try {
    const decodedToken = jwtDecode<{ role: string }>(token);
    const role = decodedToken.role;

    // Define role-based access
    const rolePages = {
      Admin: ["/admin"],
      Manager: ["/manager"],
      User: ["/user"],
    };

    const currentPath = request.nextUrl.pathname;

    // Check if the user has access to the requested page
    const hasAccess = Object.entries(rolePages).some(
      ([userRole, pages]) => userRole === role && pages.includes(currentPath)
    );

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.redirect(new URL("/loginsignup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/manager", "/user"], // Protect these routes
};
