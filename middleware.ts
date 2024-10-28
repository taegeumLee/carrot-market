import getSession from "@/lib/session/session";
import { Elsie_Swash_Caps } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyURLs: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;
  const isPublicPage = publicOnlyURLs[pathname];

  // 로그인하지 않은 사용자
  if (!session.id) {
    // 보호된 페이지에 접근하려고 할 때
    if (!isPublicPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // 로그인한 사용자
  else if (isPublicPage) {
    // 공개 페이지에 접근하려고 할 때
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
