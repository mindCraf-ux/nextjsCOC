//here we are using JWT to maintain the session 
//here we add a middleware to redirect the user to the dashboard if the user is already logged in //and also redirect the user to the home page if the user is not logged in


import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  // If user is already authenticated and visits auth/landing pages, redirect to dashboard
  if (
    token &&
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  // If user is NOT authenticated and visits a protected route, redirect to sign-in
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  return NextResponse.next()
}
export default proxy
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}