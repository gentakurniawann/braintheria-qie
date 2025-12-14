import { NextResponse, type NextRequest } from 'next/server';

const publicPages = ['/auth/sign-in'];
const publicAssetPatterns = [/^\/_next\//, /^\/images\//, /^\/fonts\//, /^\/favicon/, /^\/api\//];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  const path = request.nextUrl.pathname;

  const isPublicAsset = publicAssetPatterns.some((p) => p.test(path));
  if (isPublicAsset) return NextResponse.next();

  const isAuthPage = publicPages.includes(path);

  // Parse user cookie safely (optional)
  // let userData = null;
  // try {
  //   userData = userCookie ? JSON.parse(userCookie) : null;
  // } catch {
  //   // invalid cookie -> logout
  //   const res = NextResponse.redirect(new URL('/auth/sign-in', request.url));
  //   res.cookies.delete('token');
  //   res.cookies.delete('user');
  //   return res;
  // }

  // Unauthenticated access
  // if (!token || !userData) {
  //   if (isAuthPage) return NextResponse.next();
  //   const redirectUrl = new URL('/auth/sign-in', request.url);
  //   redirectUrl.searchParams.set('next', path);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // Authenticated user accessing auth page
  // if (isAuthPage && token && userData) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
