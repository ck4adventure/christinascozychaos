'use client';

import { FlowerType } from '@/types';

interface FlowerProps {
  type: FlowerType;
  bloomed: boolean;
  size?: number;
}

const FLOWERS: Record<FlowerType, { bud: string; bloom: string; color: string; accent: string }> = {
  rose: {
    color: '#e05c7a',
    accent: '#f9a8b8',
    bud: `<ellipse cx="12" cy="14" rx="4" ry="6" fill="#e05c7a" opacity="0.9"/>
          <path d="M12 20 Q10 22 12 24 Q14 22 12 20" fill="#4a7c59"/>
          <line x1="12" y1="20" x2="12" y2="26" stroke="#4a7c59" stroke-width="1.5"/>`,
    bloom: `<circle cx="12" cy="12" r="3" fill="#f9c0cc"/>
            <ellipse cx="12" cy="6"  rx="3.5" ry="5" fill="#e05c7a" opacity="0.92"/>
            <ellipse cx="17.5" cy="9"  rx="3.5" ry="5" fill="#e05c7a" opacity="0.85" transform="rotate(60 17.5 9)"/>
            <ellipse cx="17.5" cy="15" rx="3.5" ry="5" fill="#e05c7a" opacity="0.85" transform="rotate(120 17.5 15)"/>
            <ellipse cx="12" cy="18" rx="3.5" ry="5" fill="#e05c7a" opacity="0.92" transform="rotate(180 12 18)"/>
            <ellipse cx="6.5" cy="15" rx="3.5" ry="5" fill="#e05c7a" opacity="0.85" transform="rotate(240 6.5 15)"/>
            <ellipse cx="6.5" cy="9"  rx="3.5" ry="5" fill="#e05c7a" opacity="0.85" transform="rotate(300 6.5 9)"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#4a7c59" stroke-width="1.5"/>`,
  },
  daisy: {
    color: '#f5e642',
    accent: '#fffbe6',
    bud: `<ellipse cx="12" cy="14" rx="3.5" ry="5.5" fill="#c8d44a" opacity="0.9"/>
          <line x1="12" y1="20" x2="12" y2="26" stroke="#4a7c59" stroke-width="1.5"/>`,
    bloom: `<circle cx="12" cy="12" r="3.5" fill="#f5c842"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(45 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(90 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(135 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(180 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(225 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(270 12 12)"/>
            <ellipse cx="12" cy="5"   rx="2.5" ry="5" fill="#fffbe6" transform="rotate(315 12 12)"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#4a7c59" stroke-width="1.5"/>`,
  },
  tulip: {
    color: '#e8603a',
    accent: '#f4a482',
    bud: `<path d="M12 8 Q8 10 8 16 Q8 20 12 21 Q16 20 16 16 Q16 10 12 8Z" fill="#e8603a" opacity="0.92"/>
          <line x1="12" y1="21" x2="12" y2="27" stroke="#4a7c59" stroke-width="1.5"/>
          <path d="M12 24 Q9 22 8 20" stroke="#4a7c59" stroke-width="1" fill="none"/>`,
    bloom: `<path d="M12 5 Q7 7 7 13 Q7 19 12 21 Q17 19 17 13 Q17 7 12 5Z" fill="#e8603a" opacity="0.95"/>
            <path d="M12 5 Q9 6 8 10 Q9 7 12 6Z" fill="#f4a482" opacity="0.6"/>
            <path d="M7 11 Q4 9 4 14 Q4 18 8 19" fill="#e8603a" opacity="0.7"/>
            <path d="M17 11 Q20 9 20 14 Q20 18 16 19" fill="#e8603a" opacity="0.7"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#4a7c59" stroke-width="1.5"/>
            <path d="M12 25 Q9 23 8 21" stroke="#4a7c59" stroke-width="1" fill="none"/>`,
  },
  sunflower: {
    color: '#f5a623',
    accent: '#ffd97d',
    bud: `<circle cx="12" cy="13" r="5" fill="#8B6914" opacity="0.85"/>
          <line x1="12" y1="18" x2="12" y2="26" stroke="#4a7c59" stroke-width="1.5"/>`,
    bloom: `<circle cx="12" cy="12" r="4" fill="#6B4F10"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(0 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(40 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(80 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#ffd97d" transform="rotate(120 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(160 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(200 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#ffd97d" transform="rotate(240 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(280 12 12)"/>
            <ellipse cx="12" cy="4.5" rx="2.8" ry="5" fill="#f5a623" transform="rotate(320 12 12)"/>
            <circle cx="12" cy="12" r="4" fill="#6B4F10"/>
            <circle cx="12" cy="12" r="2.5" fill="#8B6520"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#4a7c59" stroke-width="1.5"/>`,
  },
  lotus: {
    color: '#d186c4',
    accent: '#f5c6ef',
    bud: `<ellipse cx="12" cy="14" rx="4" ry="6" fill="#d186c4" opacity="0.88"/>
          <ellipse cx="8.5" cy="16" rx="2.5" ry="5" fill="#d186c4" opacity="0.65" transform="rotate(-20 8.5 16)"/>
          <ellipse cx="15.5" cy="16" rx="2.5" ry="5" fill="#d186c4" opacity="0.65" transform="rotate(20 15.5 16)"/>
          <line x1="12" y1="20" x2="12" y2="26" stroke="#4a7c59" stroke-width="1.5"/>`,
    bloom: `<ellipse cx="12" cy="8"  rx="3" ry="6" fill="#d186c4" opacity="0.95"/>
            <ellipse cx="12" cy="8"  rx="3" ry="6" fill="#d186c4" opacity="0.8"  transform="rotate(35 12 14)"/>
            <ellipse cx="12" cy="8"  rx="3" ry="6" fill="#d186c4" opacity="0.8"  transform="rotate(-35 12 14)"/>
            <ellipse cx="12" cy="8"  rx="3" ry="6" fill="#f5c6ef" opacity="0.7"  transform="rotate(70 12 14)"/>
            <ellipse cx="12" cy="8"  rx="3" ry="6" fill="#f5c6ef" opacity="0.7"  transform="rotate(-70 12 14)"/>
            <circle cx="12" cy="13" r="2.5" fill="#f9e0f6"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#4a7c59" stroke-width="1.5"/>`,
  },
  cherry: {
    color: '#f4a7b9',
    accent: '#fce4ec',
    bud: `<ellipse cx="12" cy="14" rx="3.5" ry="5" fill="#f4a7b9" opacity="0.9"/>
          <line x1="12" y1="19" x2="12" y2="26" stroke="#6B3A2A" stroke-width="1.5"/>`,
    bloom: `<circle cx="12" cy="12" r="2" fill="#fce4ec"/>
            <ellipse cx="12" cy="6"  rx="3" ry="4.5" fill="#f4a7b9" opacity="0.9"/>
            <ellipse cx="12" cy="6"  rx="3" ry="4.5" fill="#f4a7b9" opacity="0.85" transform="rotate(72 12 12)"/>
            <ellipse cx="12" cy="6"  rx="3" ry="4.5" fill="#fce4ec" opacity="0.85" transform="rotate(144 12 12)"/>
            <ellipse cx="12" cy="6"  rx="3" ry="4.5" fill="#f4a7b9" opacity="0.85" transform="rotate(216 12 12)"/>
            <ellipse cx="12" cy="6"  rx="3" ry="4.5" fill="#fce4ec" opacity="0.85" transform="rotate(288 12 12)"/>
            <circle cx="10.5" cy="11" r="0.8" fill="#c0647a"/>
            <circle cx="13.5" cy="11" r="0.8" fill="#c0647a"/>
            <circle cx="12"   cy="13" r="0.8" fill="#c0647a"/>
            <line x1="12" y1="21" x2="12" y2="28" stroke="#6B3A2A" stroke-width="1.5"/>`,
  },
};

export default function Flower({ type, bloomed, size = 32 }: FlowerProps) {
  const flower = FLOWERS[type];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 28"
      style={{
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease',
        transform: bloomed ? 'scale(1)' : 'scale(0.85)',
        filter: bloomed
          ? `drop-shadow(0 0 4px ${flower.color}88)`
          : 'none',
        transformOrigin: 'bottom center',
      }}
      dangerouslySetInnerHTML={{
        __html: bloomed ? flower.bloom : flower.bud,
      }}
    />
  );
}
