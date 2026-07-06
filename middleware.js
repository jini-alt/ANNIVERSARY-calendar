import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/', '/index.html'],
};

export default function middleware(req) {
  const session = req.cookies.get('session');

  // 로그인 안 된 경우 /login으로 리다이렉트
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
