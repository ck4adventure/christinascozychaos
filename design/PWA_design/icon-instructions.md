# PWA Icon Generation — Christina's Cozy Chaos
## Instructions for Claude Code

Use the existing `ccc-logo.svg` (the circular plum logo with crescent moon,
stars and amber accents) as the source to generate all PNG icons below.

Place all generated icons in: `public/icons/`

---

## Required Icon Sizes

| Filename                  | Size       | Purpose                          |
|---------------------------|------------|----------------------------------|
| icon-32.png               | 32×32      | Browser favicon                  |
| icon-72.png               | 72×72      | Android home screen (legacy)     |
| icon-96.png               | 96×96      | Android home screen              |
| icon-128.png              | 128×128    | Chrome Web Store                 |
| icon-144.png              | 144×144    | Windows tile / IE                |
| icon-152.png              | 152×152    | iPad home screen (non-retina)    |
| icon-192.png              | 192×192    | Android home screen (main)       |
| icon-384.png              | 384×384    | Android splash screen            |
| icon-512.png              | 512×512    | Android splash / PWA install     |
| icon-maskable-192.png     | 192×192    | Android adaptive icon (192)      |
| icon-maskable-512.png     | 512×512    | Android adaptive icon (512)      |

---

## Regular Icons (any / purpose)
- Use the full `ccc-logo.svg` as-is — it already has the dark circular background
- The circular shape looks great on all platforms

## Maskable Icons
Maskable icons need a "safe zone" — the actual logo should sit within the
central **80% of the canvas** and the outer 10% padding on each side should
be filled with the background color `#2A0E30` (deep plum).

This ensures Android's adaptive icon system can crop it into any shape
(circle, squircle, square etc.) without cutting into the moon or stars.

---

## Generation command using sharp (Node.js):

```bash
npm install sharp
node generate-icons.js
```

```javascript
// generate-icons.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SVG_PATH = path.join(__dirname, 'public', 'ccc-logo.svg');
const OUT_DIR  = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const icons = [
  { name: 'icon-32.png',           size: 32,  maskable: false },
  { name: 'icon-72.png',           size: 72,  maskable: false },
  { name: 'icon-96.png',           size: 96,  maskable: false },
  { name: 'icon-128.png',          size: 128, maskable: false },
  { name: 'icon-144.png',          size: 144, maskable: false },
  { name: 'icon-152.png',          size: 152, maskable: false },
  { name: 'icon-192.png',          size: 192, maskable: false },
  { name: 'icon-384.png',          size: 384, maskable: false },
  { name: 'icon-512.png',          size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true  },
  { name: 'icon-maskable-512.png', size: 512, maskable: true  },
];

async function generate() {
  for (const icon of icons) {
    if (icon.maskable) {
      // For maskable: shrink logo to 80% and add #2A0E30 padding
      const innerSize = Math.round(icon.size * 0.8);
      const padding   = Math.round(icon.size * 0.1);
      const resized = await sharp(SVG_PATH)
        .resize(innerSize, innerSize)
        .toBuffer();
      await sharp({
        create: {
          width: icon.size, height: icon.size,
          channels: 4,
          background: { r: 42, g: 14, b: 48, alpha: 1 }, // #2A0E30
        }
      })
        .composite([{ input: resized, top: padding, left: padding }])
        .png()
        .toFile(path.join(OUT_DIR, icon.name));
    } else {
      await sharp(SVG_PATH)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(OUT_DIR, icon.name));
    }
    console.log(`✓ ${icon.name}`);
  }
  console.log('\n🌙 All icons generated!');
}

generate().catch(console.error);
```

---

## File placement summary

```
public/
├── manifest.json          ← copy from outputs/pwa/manifest.json
├── ccc-logo.svg           ← your existing logo
└── icons/
    ├── icon-32.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```
