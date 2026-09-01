'use client';

import { useRouter } from 'next/navigation';

type Tab = 'today' | 'schedule' | 'history' | 'add';

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV_LINKS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today',    icon: '☀️', label: 'Today'    },
  { id: 'schedule', icon: '📅', label: 'Schedule' },
  { id: 'history',  icon: '📜', label: 'History'  },
];

const ADD_ITEM = { id: 'add' as Tab, icon: '＋', label: 'Add Task' };

export default function NavBar({ active, onChange }: NavBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="nav-tabs nav-tabs--sidebar">
      <div className="nav-brand">
        <span className="nav-brand-icon">🌸</span>
        <span className="nav-brand-text">Blossom</span>
      </div>
      {[...NAV_LINKS, ADD_ITEM].map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={[
            'nav-tab nav-item--sidebar',
            active === id ? 'nav-tab--active' : '',
            id === 'add'  ? 'blossom-nav-item--add'    : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="nav-tab-icon">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
      <button className="nav-tab nav-item--sidebar blossom-nav-item--logout" onClick={handleLogout}>
        <span className="nav-tab-icon">↩</span>
        <span>Sign out</span>
      </button>
    </nav>
  );
}
