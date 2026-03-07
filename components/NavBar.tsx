'use client';

type Tab = 'today' | 'history' | 'add';

interface NavBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today',   icon: '🌙', label: 'Today'   },
  { id: 'add',     icon: '＋', label: 'Add'     },
  { id: 'history', icon: '📜', label: 'History' },
];

export default function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(0deg, rgba(26,8,30,0.97) 0%, rgba(42,14,48,0.95) 100%)',
      borderTop: '1px solid rgba(123,63,110,0.3)',
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
              fontWeight: isActive ? 400 : 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: isActive ? '#E8A020' : 'rgba(155,96,144,0.65)',
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
