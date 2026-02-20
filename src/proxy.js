import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

async function getUserFromToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🚫 Skip static & api files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  const user = token ? await getUserFromToken(token) : null;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isHome = pathname === "/";
  const isDashboardRoot = pathname === "/dashboard";

  // 🔒 NOT LOGGED IN → BLOCK DASHBOARD & ADMIN
  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 LOGGED IN → BLOCK LOGIN / SIGNUP / HOME
  if (user && (isLogin || isSignup || isHome)) {
    return NextResponse.redirect(
      new URL(
        user.role === "admin"
          ? `/admin/${user.username}`
          : `/dashboard/${user.username}`,
        req.url
      )
    );
  }

  // 🔄 DASHBOARD ROOT → DASHBOARD/:USERNAME
  if (user && isDashboardRoot) {
    return NextResponse.redirect(
      new URL(`/dashboard/${user.username}`, req.url)
    );
  }

  // 🔐 ADMIN ONLY ROUTES
  if (isAdmin && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};