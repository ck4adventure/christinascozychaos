'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const AUTHED_PREFIXES = ['/blossom', '/writing'];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const isAuthed = AUTHED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="top-bar">
      {!isHome && (
        <Link href="/" className="btn btn--link top-bar-link">Home</Link>
      )}
      {isAuthed && (
        <button onClick={handleLogout} className="btn btn--link top-bar-link">Sign out</button>
      )}
      <ThemeToggle />
    </div>
  );
}
