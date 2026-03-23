'use client';

type Tab = 'today' | 'schedule' | 'history' | 'add';

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV_LINKS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today',    icon: '🌙', label: 'Today'    },
  { id: 'schedule', icon: '📅', label: 'Schedule' },
  { id: 'history',  icon: '📜', label: 'History'  },
];

const ADD_ITEM = { id: 'add' as Tab, icon: '＋', label: 'Add Task' };

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav className="blossom-nav">
      <div className="blossom-nav-brand">
        <span className="blossom-nav-brand-icon">🌸</span>
        <span className="blossom-nav-brand-text">Blossom</span>
      </div>
      {[...NAV_LINKS, ADD_ITEM].map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={[
            'blossom-nav-item',
            active === id ? 'blossom-nav-item--active' : '',
            id === 'add'  ? 'blossom-nav-item--add'    : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="blossom-nav-icon">{icon}</span>
          <span className="blossom-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
