import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sessionOptions, SessionData } from '@/lib/session';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username === process.env.AUTH_USERNAME &&
    password === process.env.AUTH_PASSWORD
  ) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.user = { loggedIn: true };
    await session.save();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
