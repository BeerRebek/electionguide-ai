import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ElectionGuide AI — Root Middleware
 *
 * Responsibilities:
 * 1. Refresh Supabase auth session on every request
 * 2. Protect authenticated routes
 * 3. Admin role check for /admin/* routes
 * 4. Onboarding redirect for new users (profile.onboarded=false)
 * 5. Redirect authenticated users away from auth pages
 * 6. Set locale cookie from Accept-Language for next-intl
 * 7. Preserve query parameters during redirects
 */

// ── Route Classification ─────────────────────────────────────
const PROTECTED_ROUTES = [
  "/dashboard",
  "/chat",
  "/onboarding",
  "/admin",
  "/leaderboard",
  "/quiz",
  "/booth-finder",
  "/registration",
  "/candidates",
  "/guides",
  "/timeline",
  "/profile",
];

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/reset-password", "/admin/signin"];

const ADMIN_ROUTES = ["/admin"];

// Routes exempt from onboarding redirect
const ONBOARDING_EXEMPT = ["/onboarding", "/profile", "/api"];

const SUPPORTED_LOCALES = [
  "en", "hi", "bn", "te", "mr", "ta",
  "gu", "kn", "ml", "pa", "as", "or",
  "ur", "ne", "sa",
];

// ── Helpers ──────────────────────────────────────────────────
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

function buildRedirectUrl(
  request: NextRequest,
  pathname: string,
  preserveParams = true
): URL {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  if (!preserveParams) {
    url.search = "";
  }
  return url;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── 1. Locale detection (set cookie if missing) ────────────
  if (!request.cookies.get("NEXT_LOCALE")) {
    const acceptLang = request.headers.get("accept-language") || "";
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().split("-")[0])
      .find((l) => SUPPORTED_LOCALES.includes(l));

    if (preferred) {
      supabaseResponse.cookies.set("NEXT_LOCALE", preferred, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  // ── 2. Auth routes: allow unauthenticated, redirect authenticated → /dashboard ──
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (user) {
      return NextResponse.redirect(
        buildRedirectUrl(request, "/dashboard", false)
      );
    }
    // Unauthenticated user on auth page → allow through
    return supabaseResponse;
  }

  // ── 3. Protected routes: redirect unauthenticated → /signin ──
  if (matchesRoute(pathname, PROTECTED_ROUTES) && !user) {
    const url = buildRedirectUrl(request, "/signin", false);
    url.searchParams.set("returnTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // ── 4. Admin role check ────────────────────────────────────
  if (matchesRoute(pathname, ADMIN_ROUTES) && user) {
    // Skip check for admin signin page
    if (pathname === "/admin/signin") {
      return supabaseResponse;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const isAdminUser = role === "admin" || role === "super_admin";
    const isContentManager = role === "content_manager";

    // Content managers can only access /admin/documents and /admin/quizzes
    if (isContentManager) {
      const allowedPaths = ["/admin/documents", "/admin/quizzes"];
      if (!allowedPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(
          buildRedirectUrl(request, "/admin/documents", false)
        );
      }
    } else if (!isAdminUser) {
      // Regular users get bounced to dashboard
      return NextResponse.redirect(
        buildRedirectUrl(request, "/dashboard", false)
      );
    }
  }

  // ── 5. Onboarding enforcement ──────────────────────────────
  // Authenticated users who haven't completed onboarding are redirected
  // to /onboarding (unless they're already on an exempt route)
  if (user && !matchesRoute(pathname, ONBOARDING_EXEMPT) && !matchesRoute(pathname, AUTH_ROUTES)) {
    // Use a cookie cache to avoid DB call on every request
    const onboardedCookie = request.cookies.get("onboarded")?.value;

    if (onboardedCookie === undefined) {
      // First visit — check DB
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Cache the result in a cookie
        supabaseResponse.cookies.set("onboarded", profile.onboarded ? "true" : "false", {
          path: "/",
          maxAge: 60 * 60, // 1 hour cache
          sameSite: "lax",
          httpOnly: true,
        });

        if (!profile.onboarded) {
          return NextResponse.redirect(
            buildRedirectUrl(request, "/onboarding", false)
          );
        }
      }
      // If profile doesn't exist yet (just signed up), don't block
    } else if (onboardedCookie === "false") {
      return NextResponse.redirect(
        buildRedirectUrl(request, "/onboarding", false)
      );
    }
  }

  // ── 6. Already-onboarded user visiting /onboarding → /dashboard ──
  if (user && pathname === "/onboarding") {
    const onboardedCookie = request.cookies.get("onboarded")?.value;
    if (onboardedCookie === "true") {
      return NextResponse.redirect(
        buildRedirectUrl(request, "/dashboard", false)
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
