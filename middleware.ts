import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user?.loggedIn) {
      if (isApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch {
    // Session read failed (e.g. missing/invalid SESSION_SECRET) — treat as unauthenticated
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/blossom/:path*', '/api/tasks/:path*', '/api/logs/:path*'],
};
