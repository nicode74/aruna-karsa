import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Only execute session checks and routing redirects for the admin path
  if (request.nextUrl.pathname.startsWith("/admin")) {
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
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLoginPage = request.nextUrl.pathname === "/admin/login";
    const isSignupPage = request.nextUrl.pathname === "/admin/signup";
    const isForgotPasswordPage = request.nextUrl.pathname === "/admin/forgot-password";
    const isResetPasswordPage = request.nextUrl.pathname === "/admin/reset-password";

    const isPublicAdminPage = isLoginPage || isSignupPage || isForgotPasswordPage || isResetPasswordPage;

    if (!user && !isPublicAdminPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (user && (isLoginPage || isSignupPage || isForgotPasswordPage)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
