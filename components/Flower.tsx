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
  white_lotus: {
    color: '#a89cd8',
    accent: '#d8d0f5',
    bud: `<ellipse cx="12" cy="24" rx="9" ry="2.8" fill="#4a8c48" opacity="0.95"/>
          <ellipse cx="11" cy="23.4" rx="6" ry="1.6" fill="#65a858" opacity="0.38"/>
          <ellipse cx="12" cy="13" rx="5" ry="8" fill="#b8b0d8" opacity="0.55"/>
          <ellipse cx="12" cy="13" rx="3.5" ry="8" fill="#d0caf0" opacity="0.85"/>
          <ellipse cx="12" cy="13" rx="2" ry="7" fill="#e4e0f8"/>`,
    bloom: `<ellipse cx="12" cy="24" rx="9" ry="2.8" fill="#4a8c48" opacity="0.95"/>
            <ellipse cx="11" cy="23.4" rx="6" ry="1.6" fill="#65a858" opacity="0.38"/>
            <ellipse cx="12" cy="15" rx="2.8" ry="6" fill="#c4bce8" opacity="0.78" transform="rotate(-65 12 21)"/>
            <ellipse cx="12" cy="15" rx="2.8" ry="6" fill="#c4bce8" opacity="0.85" transform="rotate(-30 12 21)"/>
            <ellipse cx="12" cy="15" rx="2.8" ry="6" fill="#c4bce8" opacity="0.95"/>
            <ellipse cx="12" cy="15" rx="2.8" ry="6" fill="#c4bce8" opacity="0.85" transform="rotate(30 12 21)"/>
            <ellipse cx="12" cy="15" rx="2.8" ry="6" fill="#c4bce8" opacity="0.78" transform="rotate(65 12 21)"/>
            <ellipse cx="12" cy="16.5" rx="1.8" ry="4.5" fill="#ddd6f5" opacity="0.9" transform="rotate(-20 12 21)"/>
            <ellipse cx="12" cy="16.5" rx="1.8" ry="5" fill="#ddd6f5" opacity="0.95"/>
            <ellipse cx="12" cy="16.5" rx="1.8" ry="4.5" fill="#ddd6f5" opacity="0.9" transform="rotate(20 12 21)"/>
            <circle cx="12" cy="19.5" r="2.2" fill="#f9e878" opacity="0.88"/>
            <circle cx="12" cy="19.5" r="1.2" fill="#ddb828"/>`,
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
  passionflower: {
    color: '#9878c8',
    accent: '#b090d8',
    bud: `<path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(36 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(72 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(108 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(144 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(180 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(216 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(252 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(288 12 12)"/>
          <path d="M12,12 C11.2,9.8 10.9,6.8 12,3 C13.1,6.8 12.8,9.8 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(324 12 12)"/>
          <circle cx="12" cy="12" r="5" fill="#f0e6d8" stroke="#c8b49a" stroke-width="0.6"/>
          <circle cx="12" cy="12" r="3.5" fill="#f8f0e4" stroke="#d0bfaa" stroke-width="0.5"/>
          <circle cx="12" cy="12" r="2" fill="#fdf8f2"/>`,
    bloom: `<path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(36 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(72 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(108 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(144 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(180 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(216 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(252 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#e8ddd0" stroke="#c4b09c" stroke-width="0.4" transform="rotate(288 12 12)"/>
            <path d="M12,12 C10.8,9.9 10.3,6.1 12,3 C13.7,6.1 13.2,9.9 12,12 Z" fill="#ece2d4" stroke="#c4b09c" stroke-width="0.4" transform="rotate(324 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(0 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(12 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(24 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(36 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(48 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(60 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(72 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(84 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(96 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(108 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(120 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(132 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(144 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(156 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(168 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(180 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(192 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(204 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(216 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(228 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(240 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(252 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(264 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(276 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(288 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(300 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(312 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(324 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#9878c8" stroke-width="0.5" transform="rotate(336 12 12)"/>
            <line x1="12" y1="7" x2="12" y2="3.5" stroke="#b090d8" stroke-width="0.5" transform="rotate(348 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(6 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(18 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(30 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(42 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(54 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(66 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(78 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(90 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(102 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(114 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(126 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(138 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(150 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(162 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(174 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(186 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(198 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(210 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(222 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(234 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(246 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(258 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(270 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(282 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(294 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(306 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(318 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(330 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(342 12 12)"/>
            <line x1="12" y1="7.5" x2="12" y2="5.8" stroke="#c8a8e8" stroke-width="0.4" transform="rotate(354 12 12)"/>
            <circle cx="12" cy="12" r="3.5" fill="#f0e8d8" stroke="#c8b49a" stroke-width="0.5"/>
            <ellipse cx="12" cy="9.8" rx="0.65" ry="1.1" fill="#d4a820" stroke="#b89010" stroke-width="0.3"/>
            <ellipse cx="12" cy="9.8" rx="0.65" ry="1.1" fill="#d4a820" stroke="#b89010" stroke-width="0.3" transform="rotate(72 12 12)"/>
            <ellipse cx="12" cy="9.8" rx="0.65" ry="1.1" fill="#d4a820" stroke="#b89010" stroke-width="0.3" transform="rotate(144 12 12)"/>
            <ellipse cx="12" cy="9.8" rx="0.65" ry="1.1" fill="#d4a820" stroke="#b89010" stroke-width="0.3" transform="rotate(216 12 12)"/>
            <ellipse cx="12" cy="9.8" rx="0.65" ry="1.1" fill="#d4a820" stroke="#b89010" stroke-width="0.3" transform="rotate(288 12 12)"/>
            <circle cx="12" cy="10.3" r="0.9" fill="#8a6090" stroke="#6a4070" stroke-width="0.4" transform="rotate(0 12 12)"/>
            <circle cx="12" cy="10.3" r="0.9" fill="#8a6090" stroke="#6a4070" stroke-width="0.4" transform="rotate(120 12 12)"/>
            <circle cx="12" cy="10.3" r="0.9" fill="#8a6090" stroke="#6a4070" stroke-width="0.4" transform="rotate(240 12 12)"/>
            <circle cx="12" cy="12" r="1.3" fill="#fdf8f0" stroke="#d0c0a0" stroke-width="0.4"/>`,
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
