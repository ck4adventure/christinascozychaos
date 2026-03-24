export interface SessionData {
  user?: { loggedIn: boolean };
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'ccc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};
