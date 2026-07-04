'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [destination, setDestination] = useState('/blossom');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from') ?? '';
    // Only accept internal paths; reject empty, external, or protocol-relative values
    const dest = from.startsWith('/') && !from.startsWith('//') ? from : '/blossom';
    setDestination(dest);

    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ loggedIn }) => { if (loggedIn) router.replace(dest); });

    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push(destination);
    } else {
      setError('Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="bowl-page">
      <div className={`bowl-inner${visible ? ' bowl-visible' : ''}`}>
        <Link href="/" className="btn btn--link" style={{ marginBottom: "2.5rem" }}>← Home</Link>

        <div className="login-header">
          <p className="eyebrow">Welcome back</p>
          <h1 className="title" style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)' }}>
            Christina&apos;s<br /><em>Cozy Chaos</em>
          </h1>
        </div>

        <div className="card login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="btn btn--outline"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
