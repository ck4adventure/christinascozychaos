'use client';

type Tab = 'today' | 'schedule' | 'history' | 'add';

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today',    icon: '🌙', label: 'Today'    },
  { id: 'schedule', icon: '📅', label: 'Schedule' },
  { id: 'add',      icon: '＋', label: 'Add'      },
  { id: 'history',  icon: '📜', label: 'History'  },
];

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--color-bg-nav)',
      borderTop: '1px solid var(--color-border-default)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom))',
      zIndex: 90,
    }}>
      {NAV_ITEMS.map(({ id, icon, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 20px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              fontSize: id === 'add' ? '1.5rem' : '1.2rem',
              lineHeight: 1,
              filter: isActive ? 'drop-shadow(0 0 6px rgba(232,160,32,0.7))' : 'none',
              transition: 'filter 0.3s ease',
            }}>
              {icon}
            </span>
            <span style={{
              fontFamily: "var(--font-josefin), sans-serif",
              fontSize: '0.62rem',
              fontWeight: isActive ? 400 : 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--amber)' : 'var(--color-text-muted-soft)',
              transition: 'color 0.3s ease',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
